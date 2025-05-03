const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const dialogflow = require('dialogflow');
// linara intialization
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = require("./routes/CropR_Routes");
const User = require("./models/RegisterModel"); // Import the Register model
//hashini intialization
const localrouter = require("./routes/localMarketSalesRoutes");
const exportrouter = require("./routes/ExportSalesRoutes");
//keshani intialization
const expenseRoutes = require("./routes/expenseroute");


// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
//hashini 
// Define Routes
app.use("/localincome", localrouter);
app.use("/exportincome", exportrouter);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Farmer model
const FarmerSchema = new mongoose.Schema({
  name: String,
  language: String,
  question: String,
  lat: Number,
  lon: Number,
  timestamp: { type: Date, default: Date.now },
});
const Farmer = mongoose.model('Farmer', FarmerSchema);

// Register model
// const RegisterSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   gmail: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   cpassword: { type: String, required: true },
//   number: { type: String, required: true },
// });
// const User = mongoose.model('Register', RegisterSchema);

// OpenWeather API key validation
const OPENWEATHER_API_KEY = process.env.WEATHER_API_KEY;
if (!OPENWEATHER_API_KEY) {
  console.error('OpenWeather API key is missing. Please set WEATHER_API_KEY in .env');
  process.exit(1);
}

// Dialogflow client initialization
let sessionClient;
try {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  sessionClient = new dialogflow.SessionsClient({ credentials });
  console.log('Dialogflow client initialized successfully');
} catch (error) {
  console.error('Error initializing Dialogflow client:', error.message);
  process.exit(1);
}

// Crop name mapping
const cropNameMapping = {
  'තක්කාලි': 'tomato',
  'தக்காளி': 'tomato',
  'බඩ ඉරිඟු': 'corn',
  'மக்காச்சோளம்': 'corn',
  'කරපිංචා': 'curry leaves',
  'கறிவேப்பிலை': 'curry leaves',
  'හාල්': 'rice',
  'அரிசி': 'rice',
};

// Local crop data
const cropData = {
  tomato: {
    name: 'tomato',
    sow_method: 'direct sowing',
    sow_depth: '1 cm',
    transplant_spacing: '30-60 cm',
    planting_seasons: {
      yala: true,
      maha: true,
      best_planting_time: 'March to May (Yala) or September to November (Maha)',
    },
  },
  rice: {
    name: 'rice',
    sow_method: 'transplanting',
    sow_depth: '2-3 cm',
    transplant_spacing: '20-25 cm',
    planting_seasons: {
      yala: true,
      maha: true,
      best_planting_time: 'March to May (Yala) or September to January (Maha)',
    },
  },
  corn: {
    name: 'corn',
    sow_method: 'direct sowing',
    sow_depth: '2-3 cm',
    transplant_spacing: '20-30 cm',
    planting_seasons: {
      yala: true,
      maha: false,
      best_planting_time: 'March to May (Yala)',
    },
  },
  'curry leaves': {
    name: 'curry leaves',
    sow_method: 'transplanting',
    sow_depth: '1-2 cm',
    transplant_spacing: '40-50 cm',
    planting_seasons: {
      yala: true,
      maha: true,
      best_planting_time: 'Year-round with irrigation',
    },
  },
};

// Weather API endpoint
app.get('/weather', async (req, res) => {
  let url;
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);

  if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
    url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  } else if (req.query.city) {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  } else {
    url = `http://api.openweathermap.org/data/2.5/weather?q=Colombo&appid=${OPENWEATHER_API_KEY}&units=metric`;
  }

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Weather data fetch failed' });
  }
});


// Farmer question endpoint
app.post('/ask', async (req, res) => {
  const { name, language, question, lat, lon } = req.body;

  if (!name || !language || !question) {
    return res.status(400).json({ error: 'Name, language, and question are required' });
  }

  try {
    // Save farmer data
    const farmer = new Farmer({ name, language, question, lat, lon });
    await farmer.save();

    let reply = '';

    // Dialogflow intent detection
    const sessionPath = sessionClient.sessionPath('greenharvest-aibot-2025', 'session-id-' + Date.now());
    const dialogflowRequest = {
      session: sessionPath,
      queryInput: {
        text: {
          text: question,
          languageCode: language === 'sinhala' ? 'si' : language === 'tamil' ? 'ta' : 'en',
        },
      },
    };

    let intent, dialogflowResponse;
    try {
      const responses = await sessionClient.detectIntent(dialogflowRequest);
      dialogflowResponse = responses[0].queryResult;
      intent = dialogflowResponse.intent.displayName;
      console.log('Intent detected:', intent, 'Parameters:', dialogflowResponse.parameters);
    } catch (error) {
      console.error('Error with Dialogflow:', error.message);
      return res.status(500).json({
        error: language === 'sinhala'
          ? 'Dialogflow සමඟ සම්බන්ධ වීමට නොහැකි වුණා.'
          : language === 'tamil'
          ? 'Dialogflow உடன் இணைக்க முடியவில்லை.'
          : 'Unable to connect to Dialogflow.',
      });
    }

    if (intent === 'WeatherInquiry') {
      let weatherUrl;
      const city = dialogflowResponse.parameters.fields['geo-city']?.stringValue;

      if (city && city !== 'undefined') {
        weatherUrl = `http://localhost:5000/weather?city=${encodeURIComponent(city)}`;
      } else if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
        weatherUrl = `http://localhost:5000/weather?lat=${lat}&lon=${lon}`;
      } else {
        weatherUrl = `http://localhost:5000/weather?city=Colombo`;
      }

      try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const cityName = weatherData.name;

        reply = language === 'sinhala'
          ? `අද ${cityName} කාලගුණය සෙල්සියස් ${temp}°C, ${weatherDescription}. ${
              temp > 30 ? 'උණුසුම වැඩි නිසා ජලය වැඩිපුර භාවිතා කරන්න.' : 'ගොවිතැන් කරන්න හොඳයි.'
            }`
          : language === 'tamil'
          ? `இன்று ${cityName} வானிலை செல்சியஸ் ${temp}°C, ${weatherDescription}. ${
              temp > 30 ? 'வெப்பம் அதிகமாக இருப்பதால் தண்ணீர் அதிகம் பயன்படுத்தவும்.' : 'விவசாயம் செய்ய நல்லது.'
            }`
          : `Today's weather in ${cityName} is ${temp}°C, ${weatherDescription}. ${
              temp > 30 ? 'It’s hot, use more water for crops.' : 'Good for farming.'
            }`;
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
        reply = language === 'sinhala'
          ? 'කාලගුණ තොරතුරු ලබා ගැනීමට නොහැකි වුණා.'
          : language === 'tamil'
          ? 'வானிலை தகவல்களைப் பெற முடியவில்லை.'
          : 'Unable to fetch weather information.';
      }
    } else if (intent === 'CropPlanting') {
      const currentMonth = new Date().getMonth() + 1;
      const isYalaSeason = currentMonth >= 3 && currentMonth <= 8;
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[currentMonth - 1];

      const suitableCrops = Object.values(cropData)
        .filter(crop => isYalaSeason ? crop.planting_seasons.yala : crop.planting_seasons.maha)
        .map(crop => crop.name);

      if (language === 'sinhala') {
        const cropList = suitableCrops.join(', ');
        reply = `මේ මාසය (${currentMonthName}) යල කන්නයේදී ඔබට ${cropList} වගා කළ හැක. බෝග වගා කිරීමට හොඳම කාලය:\n`;
        suitableCrops.forEach(crop => {
          reply += `- ${crop}: ${cropData[crop].planting_seasons.best_planting_time}\n`;
        });
      } else if (language === 'tamil') {
        const cropList = suitableCrops.join(', ');
        reply = `இந்த மாதம் (${currentMonthName}) யல பருவத்தில் நீங்கள் ${cropList} பயிரிடலாம். சிறந்த நடவு நேரம்:\n`;
        suitableCrops.forEach(crop => {
          reply += `- ${crop}: ${cropData[crop].planting_seasons.best_planting_time}\n`;
        });
      } else {
        const cropList = suitableCrops.join(', ');
        reply = `This month (${currentMonthName}), during the ${isYalaSeason ? 'Yala' : 'Maha'} season, you can plant ${cropList}. Best planting times:\n`;
        suitableCrops.forEach(crop => {
          reply += `- ${crop}: ${cropData[crop].planting_seasons.best_planting_time}\n`;
        });
      }
    } else if (intent === 'GrowCrop') {
      let cropName = dialogflowResponse.parameters.fields.Crop?.stringValue || question.split(' ').pop();
      cropName = cropNameMapping[cropName] || cropName.toLowerCase();

      if (cropData[cropName]) {
        const crop = cropData[cropName];
        let responseText = `To grow ${crop.name}, `;
        if (crop.sow_method) responseText += `you can sow by ${crop.sow_method}. `;
        if (crop.sow_depth) responseText += `Sow at a depth of ${crop.sow_depth}. `;
        if (crop.transplant_spacing) responseText += `Space transplants ${crop.transplant_spacing}. `;
        reply = responseText;

        if (language === 'sinhala') {
          reply = `ඔබට ${crop.name} වගා කිරීමට, ${
            crop.sow_method ? `ඔබට ${crop.sow_method} මගින් බීජ පැල කළ හැකියි. ` : ''
          }${crop.sow_depth ? `බීජ ${crop.sow_depth} ගැඹුරට පැල කරන්න. ` : ''}${
            crop.transplant_spacing ? `පැල සිටවීමේදී ${crop.transplant_spacing} දුරකින් තබන්න.` : ''
          }`;
        } else if (language === 'tamil') {
          reply = `${crop.name} வளர்க்க, ${
            crop.sow_method ? `நீங்கள் ${crop.sow_method} மூலம் விதைக்கலாம். ` : ''
          }${crop.sow_depth ? `விதைகளை ${crop.sow_depth} ஆழத்தில் விதைக்கவும். ` : ''}${
            crop.transplant_spacing ? `நாற்றுகளை ${crop.transplant_spacing} இடைவெளியில் நடவும்.` : ''
          }`;
        }
      } else {
        reply = language === 'sinhala'
          ? 'මට එම බෝගය ගැන තොරතුරු හමු නොවුණා.'
          : language === 'tamil'
          ? 'அந்த பயிரைப் பற்றிய தகவல்கள் கிடைக்கவில்லை.'
          : 'I didn’t find information about that plant.';
      }
    } else if (intent === 'PestControl') {
      const cropName = dialogflowResponse.parameters.fields.Crop?.stringValue || question.split(' ').pop();
      reply = language === 'sinhala'
        ? `${cropName} සඳහා පළිබෝධකයන් පාලනය කිරීමට, කාබනික පළිබෝධකයන් භාවිතා කරන්න (උදා: neem oil).`
        : language === 'tamil'
        ? `${cropName} பயிருக்கு பூச்சிகளை கட்டுப்படுத்த, கரிம பூச்சிக்கொல்லிகளை பயன்படுத்தவும் (உதா: neem oil).`
        : `To control pests in ${cropName}, use organic pesticides like neem oil.`;
    }
    else if (intent === 'TomatoPlanting') {
            const crop = cropData.tomato;
            reply = language === 'sinhala'
              ? `තක්කාලි සිටුවීම සඳහා, අව්ව සහිත ස්ථානයක් තෝරා ගන්න, පස හොඳින් ජලය බැස යන බවත් කාබනික ද්‍රව්‍ය වලින් පොහොසත් බවත් සහතික කර ගනිමින් එය සකස් කරන්න, සහ බීජ පැල ගැඹුරට සිටුවන්න, මුල් වර්ධනය දිරිමත් කිරීම සඳහා කඳේ වැඩි කොටසක් වළලන්න. ශාක අතර ප්‍රමාණවත් පරතරයක් සහතික කරන්න (විවිධත්වය අනුව අඟල් 18-24 හෝ ඊට වැඩි).`
              : language === 'tamil'
              ? `தக்காளியை நடவு செய்ய, வெயில் படும் இடத்தைத் தேர்ந்தெடுத்து, மண்ணை நன்கு வடிகால் வசதியுடனும், கரிமப் பொருட்கள் நிறைந்ததாகவும் இருப்பதை உறுதிசெய்து, நாற்றுகளை ஆழமாக நடவும், வேர் வளர்ச்சியை ஊக்குவிக்க பெரும்பாலான தண்டுகளை புதைக்கவும். தாவரங்களுக்கு இடையில் போதுமான இடைவெளியை உறுதி செய்யவும் (வகையைப் பொறுத்து 18-24 அங்குலம் அல்லது அதற்கு மேல்).
    
   ` : `To plant tomatoes, choose a sunny location, prepare the soil to ensure good drainage and enrich it with organic matter, plant seedlings deeply, burying most of the stem to encourage root growth, and ensure adequate spacing between plants (18-24 inches or more depending on the variety).`; 
  }
  else if (intent === 'SoilManagement') {
          reply = language === 'sinhala'
            ? `ලෝම පස සාමාන්‍යයෙන් වැලි, රොන්මඩ සහ මැටි වල ක්‍රියාකාරීව සමාන දායකත්වයක් සහිත මධ්‍යම-වයනය සහිත පස ලෙස විස්තර කෙරේ. මෙම මධ්‍යම-වයනය සහිත පස බොහෝ විට කෘෂිකර්මාන්තය සඳහා වඩාත් සුදුසු යැයි සැලකේ, මන්ද ඒවා ගොවීන් විසින් පහසුවෙන් වගා කළ හැකි අතර බෝග වර්ධනය සඳහා ඉහළ ඵලදායිතාවයක් ලබා ගත හැකිය.
  `
            : language === 'tamil'
            ? `களிமண்-அமைப்பு கொண்ட மண் பொதுவாக மணல், வண்டல் மற்றும் களிமண் ஆகியவற்றின் செயல்பாட்டு ரீதியாக சமமான பங்களிப்புகளுடன் நடுத்தர அமைப்பு கொண்டதாக விவரிக்கப்படுகிறது. இந்த நடுத்தர அமைப்பு கொண்ட மண் பெரும்பாலும் விவசாயத்திற்கு ஏற்றதாகக் கருதப்படுகிறது, ஏனெனில் அவை விவசாயிகளால் எளிதில் பயிரிடப்படுகின்றன மற்றும் பயிர் வளர்ச்சிக்கு அதிக உற்பத்தித் திறன் கொண்டவை.`
            : `Loamy-textured soils are commonly described as medium textured with functionally-equal contributions of sand, silt, and clay. These medium-textured soils are often considered ideal for agriculture as they are easily cultivated by farmers and can be highly productive for crop growth.
  `;} 
  else if (intent === 'FertilizerAdvice') {
    let cropName = dialogflowResponse.parameters.fields.Crop?.stringValue || question.split(' ').pop();
    cropName = cropNameMapping[cropName] || cropName.toLowerCase();

    if (cropName === 'tomato') {
      reply = language === 'sinhala'
        ? `තක්කාලි සඳහා නිවැරදි පොහොර ප්‍රමාණය තීරණය කිරීම සඳහා, ඔබේ පසෙහි පෝෂක මට්ටම් සහ pH අගය තේරුම් ගැනීමට පාංශු පරීක්ෂණයකින් ආරම්භ කරන්න. ඉන්පසු, තක්කාලි වලට පෝෂ්‍ය පදාර්ථ සමතුලිතතාවයක්, විශේෂයෙන් පොස්පරස් සහ සාමාන්‍යයෙන් ඕනෑවට වඩා නයිට්‍රජන් අවශ්‍ය නොවන බව මතක තබා ගනිමින්, පොහොර පැකේජ උපදෙස් අනුගමනය කරන්න. ශාකයේ වර්ධන අවධිය, පස වර්ගය සහ ඔබ කාබනික හෝ කෘතිම පොහොර භාවිතා කරන්නේද යන්න සලකා බලන්න.`
        : language === 'tamil'
        ? `தக்காளிக்கு சரியான அளவு உரத்தைத் தீர்மானிக்க, உங்கள் மண்ணின் ஊட்டச்சத்து அளவுகள் மற்றும் pH ஐப் புரிந்துகொள்ள மண் பரிசோதனையுடன் தொடங்கவும். பின்னர், தக்காளிக்கு ஊட்டச்சத்துக்கள், குறிப்பாக பாஸ்பரஸ், பொதுவாக அதிக நைட்ரஜன் தேவை என்பதை மனதில் கொண்டு, உரப் பொதி வழிமுறைகளைப் பின்பற்றவும். தாவரத்தின் வளர்ச்சி நிலை, மண் வகை மற்றும் நீங்கள் கரிம அல்லது செயற்கை உரங்களைப் பயன்படுத்துகிறீர்களா என்பதைக் கவனியுங்கள்.`
        : `To determine the right amount of fertilizer for tomatoes, start with a soil test to understand your soil's nutrient levels and pH. Then, follow the fertilizer package instructions, keeping in mind that tomatoes need a balance of nutrients, especially phosphorus, and generally not too much nitrogen. Consider the plant's growth stage, soil type, and whether you're using organic or synthetic fertilizers. 
`;
    } else if (cropName === 'rice') {
      reply = language === 'sinhala'
        ? `වී සඳහා සුදුසු පොහොර ප්‍රමාණය තීරණය කිරීම සඳහා, එම ප්‍රදේශයේ ගොවීන් පාංශු විශ්ලේෂණය, බෝග සඳහා විශේෂිත අවශ්‍යතා සහ කෘෂිකර්ම අමාත්‍යාංශයේ නිර්දේශිත පිළිවෙත් සලකා බැලිය යුතුය. පාංශු පරීක්ෂාව මගින් නිශ්චිත පෝෂක ඌනතාවයන් අනාවරණය කළ හැකි අතර, බෝගයේ වර්ධන අවධිය සහ කෘෂිකර්ම දෙපාර්තමේන්තුවේ නවතම පොහොර නිර්දේශ සලකා බැලීමෙන් අස්වැන්න ප්‍රශස්ත කිරීමට සහ නාස්තිය අවම කිරීමට උපකාරී වේ.`
        : language === 'tamil'
        ? `நெல்லுக்கு ஏற்ற உர அளவை தீர்மானிக்க, அந்தந்த இடங்களில் உள்ள விவசாயிகள் மண் பகுப்பாய்வு, பயிர் சார்ந்த தேவைகள் மற்றும் வேளாண் அமைச்சகத்தின் பரிந்துரைக்கப்பட்ட நடைமுறைகளை கருத்தில் கொள்ள வேண்டும். மண் பரிசோதனை குறிப்பிட்ட ஊட்டச்சத்து குறைபாடுகளை வெளிப்படுத்தலாம், அதே நேரத்தில் பயிரின் வளர்ச்சி நிலை மற்றும் வேளாண் துறையின் சமீபத்திய உர பரிந்துரைகளை கருத்தில் கொள்வது மகசூலை மேம்படுத்தவும், வீணாவதை குறைக்கவும் உதவும்.`
        : `To determine the appropriate fertilizer quantity for rice, farmers in thir location should consider soil analysis, crop-specific needs, and the recommended practices from the Ministry of Agriculture. Soil testing can reveal specific nutrient deficiencies, while considering the crop's growth stage and the latest fertilizer recommendations from the Department of Agriculture can help optimize yield and minimize waste. `;
    } 
  }
   else {
      reply = dialogflowResponse?.fulfillmentText || (
        language === 'sinhala'
          ? 'මට තේරුණේ නැහැ, කරුණාකර ආයෙත් අහන්න.'
          : language === 'tamil'
          ? 'எனக்கு புரியவில்லை, மீண்டும் கேளுங்கள்.'
          : 'I didn’t understand, please ask again.'
      );
    }

    res.json({ reply });
  } catch (error) {
    console.error('Error in /ask endpoint:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// Process error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
});

// linara backend implementations *******************************************************************
// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user; // Store user data (including userId) in request
    next();
  });
};

// Register Endpoint
app.post("/register", async (req, res) => {
  const { name, email, password, cpassword, number } = req.body;

  try {
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "Email already in use" });
    }

    // Validate passwords match
    if (password !== cpassword) {
      return res.status(400).json({ status: "error", message: "Passwords do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      cpassword: hashedPassword, // Store hashed cpassword (optional, or remove cpassword field)
      number,
    });

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ status: "error", message: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ status: "ok", token });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Protect CropR routes
app.use("/CropR", authenticateToken, router);


//keshani implementations

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:3000",  // Frontend URL (React app)
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
};
app.use(cors(corsOptions));  // Use the CORS configuration

app.use(express.json()); 

app.use("/api", expenseRoutes);  // Base API route
// app.use("/income", incomeRoutes); 


app.get("/", (req, res) => {
  res.send("Backend is working successfully!");
});

