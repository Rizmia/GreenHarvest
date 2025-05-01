const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./Routes/CropR_Routes");

const app = express();
const cors = require("cors");

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Use the crop routes
app.use("/CropR", router);

// MongoDB Connection (specify database name)
mongoose.connect(`${process.env.MONGO_URI}test`, {  
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => console.log("❌ MongoDB connection error:", err));

// Call Register Model
require("./Model/RegisterModel");
const User = mongoose.model("Register");

app.post("/register", async (req, res) => {
    const { name, email, password, cpassword, number } = req.body;  

    try {
        const newUser = await User.create({
            name,
            email,  
            password,
            cpassword,
            number,
        });
        console.log("User created:", newUser);  
        res.send({ status: "ok" });
    } catch (err) {
        console.error("Error creating user:", err);  
        res.send({ status: "err", message: err.message });
    }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ status: "error", message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).send({ status: "error", message: "Invalid password" });
    }

    res.send({ status: "ok", message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send({ status: "error", message: "Server error" });
  }
});