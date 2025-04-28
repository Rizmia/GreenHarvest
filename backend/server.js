const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const Farmer = require('./models/Farmer');
const dialogflow = require('dialogflow');


// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


// MongoDB connection with better error handling
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

const OPENWEATHER_API_KEY = process.env.WEATHER_API_KEY;
if (!OPENWEATHER_API_KEY) {
  console.error('OpenWeather API key is missing. Please set WEATHER_API_KEY in the environment variables.');
  process.exit(1);
}

// Initialize Dialogflow client
// let sessionClient;
// try {
//   sessionClient = new dialogflow.SessionsClient({
//     keyFilename: './dialogflow-credentials.json',
//   });
//   console.log('Dialogflow client initialized successfully');
// } catch (error) {
//   console.error('Error initializing Dialogflow client:', error.message);
//   process.exit(1);
// }

let sessionClient;
try {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  sessionClient = new dialogflow.SessionsClient({
    credentials: credentials,
    
  });
  console.log('Dialogflow client initialized successfully');
} catch (error) {
  console.error('Error initializing Dialogflow client:', error.message);
  process.exit(1);
}

// Crop name mapping for translations
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

// Local crop data as a fallback if OpenFarm API fails
const cropData = {
  tomato: {
    name: 'tomato',
    sow_method: 'direct sowing',
    sow_depth: '1 cm',
    transplant_spacing: '30-60 cm',
    planting_seasons: {
      yala: true, // March to August
      maha: true, // September to March
      best_planting_time: 'March to May (Yala) or September to November (Maha)',
    },
  },
  rice: {
    name: 'rice',
    sow_method: 'transplanting',
    sow_depth: '2-3 cm',
    transplant_spacing: '20-25 cm',
    planting_seasons: {
      yala: true, // March to August
      maha: true, // September to March
      best_planting_time: 'March to May (Yala) or September to January (Maha)',
    },
  },
  corn: {
    name: 'corn',
    sow_method: 'direct sowing',
    sow_depth: '2-3 cm',
    transplant_spacing: '20-30 cm',
    planting_seasons: {
      yala: true, // March to August
      maha: false, // Not ideal for Maha
      best_planting_time: 'March to May (Yala)',
    },
  },
  'curry leaves': {
    name: 'curry leaves',
    sow_method: 'transplanting',
    sow_depth: '1-2 cm',
    transplant_spacing: '40-50 cm',
    planting_seasons: {
      yala: true, // March to August
      maha: true, // September to March
      best_planting_time: 'Year-round with irrigation',
    },
  },
};

// Weather API endpoint with validation
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

  console.log('Fetching weather from:', url);
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

  // Validate request body
  if (!name || !language || !question) {
    return res.status(400).json({ error: 'Name, language, and question are required' });
  }

  try {
    // Save farmer data to MongoDB
    const farmer = new Farmer({ name, language, question, lat, lon });
    await farmer.save();

    let reply = '';

    // Use Dialogflow to detect intent
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

    let intent;
    let dialogflowResponse;
    try {
      const responses = await sessionClient.detectIntent(dialogflowRequest);
      dialogflowResponse = responses[0].queryResult;
      intent = dialogflowResponse.intent.displayName;
      console.log('Intent detected:', intent, 'Parameters:', dialogflowResponse.parameters);
    } catch (error) {
      console.error('Error with Dialogflow:', error.message);
      return res.status(500).json({
        error: language === 'sinhala'
          ? 'Dialogflow සමඟ සම්බන්ධ වීමට නොහැකි වුණා: ' + error.message
          : language === 'tamil'
          ? 'Dialogflow உடன் இணைக்க முடியவில்லை: ' + error.message
          : 'Unable to connect to Dialogflow: ' + error.message,
      });
    }

    if (intent === 'WeatherInquiry') {
      let weatherUrl;
      const city = dialogflowResponse.parameters.fields['geo-city']?.stringValue;

      console.log('City from Dialogflow:', city);
      console.log('Lat/Lon from request:', lat, lon);

      if (city && city !== 'undefined') {
        weatherUrl = `http://localhost:5000/weather?city=${encodeURIComponent(city)}`;
      } else if (lat && lon && !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
        weatherUrl = `http://localhost:5000/weather?lat=${lat}&lon=${lon}`;
      } else {
        weatherUrl = `http://localhost:5000/weather?city=Colombo`;
      }

      console.log('Weather URL:', weatherUrl);

      try {
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;
        const temp = weatherData.main.temp;
        const weatherDescription = weatherData.weather[0].description;
        const cityName = weatherData.name;

        if (language === 'sinhala') {
          reply = `අද ${cityName} කාලගුණය සෙල්සියස් ${temp}°C, ${weatherDescription}. ${
            temp > 30 ? 'උණුසුම වැඩි නිසා ජලය වැඩිපුර භාවිතා කරන්න.' : 'ගොවිතැන් කරන්න හොඳයි.'
          }`;
        } else if (language === 'tamil') {
          reply = `இன்று ${cityName} வானிலை செல்சியஸ் ${temp}°C, ${weatherDescription}. ${
            temp > 30 ? 'வெப்பம் அதிகமாக இருப்பதால் தண்ணீர் அதிகம் பயன்படுத்தவும்.' : 'விவசாயம் செய்ய நல்லது.'
          }`;
        } else {
          reply = `Today's weather in ${cityName} is ${temp}°C, ${weatherDescription}. ${
            temp > 30 ? 'It’s hot, use more water for crops.' : 'Good for farming.'
          }`;
        }
      } catch (error) {
        console.error('Error fetching weather data:', error.message);
        reply = language === 'sinhala'
          ? 'කාලගුණ තොරතුරු ලබා ගැනීමට නොහැකි වුණා.'
          : language === 'tamil'
          ? 'வானிலை தகவல்களைப் பெற முடியவில்லை.'
          : 'Unable to fetch weather information.';
      }
    } else if (intent === 'CropPlanting') {
      // Get the current month to determine the season
      const currentMonth = new Date().getMonth() + 1; // 1 = January, 12 = December
      const isYalaSeason = currentMonth >= 3 && currentMonth <= 8; // March to August
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const currentMonthName = monthNames[currentMonth - 1];

      // Determine which crops can be planted this month
      const suitableCrops = Object.values(cropData).filter(crop => {
        return isYalaSeason ? crop.planting_seasons.yala : crop.planting_seasons.maha;
      }).map(crop => crop.name);

      // Prepare the response
      if (language === 'sinhala') {
        const cropList = suitableCrops.join(', ');
        reply = `මේ මාසය (${currentMonthName}) යල කන්නයේදී ඔබට ${cropList} වගා කළ හැක. බෝග වගා කිරීමට හොඳම කාලය බෝගය අනුව වෙනස් වේ. උදාහරණයක් ලෙස:\n`;
        suitableCrops.forEach(crop => {
          reply += `- ${crop}: ${cropData[crop].planting_seasons.best_planting_time}\n`;
        });
      } else if (language === 'tamil') {
        const cropList = suitableCrops.join(', ');
        reply = `இந்த மாதம் (${currentMonthName}) யல பருவத்தில் நீங்கள் ${cropList} பயிரிடலாம். பயிர்களை நடவு செய்ய சிறந்த நேரம் பயிரைப் பொறுத்து மாறுபடும். உதாரணமாக:\n`;
        suitableCrops.forEach(crop => {
          reply += `- ${crop}: ${cropData[crop].planting_seasons.best_planting_time}\n`;
        });
      } else {
        const cropList = suitableCrops.join(', ');
        reply = `This month (${currentMonthName}), during the ${isYalaSeason ? 'Yala' : 'Maha'} season, you can plant ${cropList}. The best time to plant crops depends on the crop. For example:\n`;
        suitableCrops.forEach(crop => {
          reply += `- ${crop}: ${cropData[crop].planting_seasons.best_planting_time}\n`;
        });
      }
    } else if (intent === 'GrowCrop') {
      let cropName = dialogflowResponse.parameters.fields.Crop?.stringValue || question.split(' ').pop();
      console.log('Crop name extracted:', cropName);

      // Translate crop name if necessary
      cropName = cropNameMapping[cropName] || cropName.toLowerCase();
      console.log('Translated crop name:', cropName);

      try {
        const cropsResponse = await axios.get(`https://openfarm.cc/api/v1/crops?search=${encodeURIComponent(cropName)}`);
        console.log('OpenFarm API response:', cropsResponse.data);
        if (cropsResponse.data.length > 0) {
          const crop = cropsResponse.data[0];
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
        } else if (cropData[cropName]) {
          // Fallback to local crop data
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
      } catch (error) {
        console.error('Error fetching crop data:', error.message);
        // Fallback to local crop data if API fails
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
            ? 'මට දැන් තොරතුරු ලබා ගැනීමට නොහැකි වුණා.'
            : language === 'tamil'
            ? 'தற்போது தகவல்களைப் பெற முடியவில்லை.'
            : 'I couldn’t fetch the information right now.';
        }
      }
    } else if (intent === 'PestControl') {
      const cropName = dialogflowResponse.parameters.fields.Crop?.stringValue || question.split(' ').pop();
      reply = language === 'sinhala'
        ? `${cropName} සඳහා පළිබෝධකයන් පාලනය කිරීමට, කාබනික පළිබෝධකයන් භාවිතා කරන්න. උදාහරණයක් විදිහට neem oil භාවිතා කරන්න.`
        : language === 'tamil'
        ? `${cropName} பயிருக்கு பூச்சிகளை கட்டுப்படுத்த, கரிம பூச்சிக்கொல்லிகளை பயன்படுத்தவும். உதாரணமாக neem oil பயன்படுத்தலாம்.`
        : `To control pests in ${cropName}, use organic pesticides like neem oil.`;
    } else {
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


  //Call Register Model

require("./Model/RegisterModel");
const User = mongoose.model("Register");

app.post("/register", async(req,res) => {
    const {name,gmail,password,cpassword,number} = req.body;

    try{
        await User.create({
            name,
            gmail,
            password,
            cpassword,
            number,

        })
        res.send({status:"ok"});
    }catch(err){
        res.send({status: "err"});
    }
})
});