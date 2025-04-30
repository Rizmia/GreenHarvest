const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./Routes/CropR_Routes"); 

const app = express();
const cors = require("cors");

// ✅ Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// ✅ Use the crop routes
app.use("/CropR", router);

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => console.log("❌ MongoDB connection error:", err));

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

