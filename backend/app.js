const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const router = require("./Routes/CropR_Routes");
const contactRoutes = require("./Routes/ContactUs_Routes"); // Add Contact Us routes
const User = require("./Model/RegisterModel"); // Import the Register model

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(`${process.env.MONGO_URI}test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));

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

// Contact Us route (public, no authentication required)
app.use("/api/contact", contactRoutes);