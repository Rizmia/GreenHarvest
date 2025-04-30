require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const localrouter = require("./Routes/localMarketSalesRoutes");
const exportrouter = require("./Routes/ExportSalesRoutes");

const app = express();
const cors = require("cors");

// Middleware for JSON parsing
app.use(express.json());
app.use(cors());

// Define Routes
app.use("/localincome", localrouter);
app.use("/exportincome", exportrouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(5000, () => console.log("Server running on port 5000"));
    })
    .catch((err) => console.log(err));
