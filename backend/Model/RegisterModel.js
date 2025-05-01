const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regiSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {  // Changed 'gmail' to 'email'
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
});

// Correct export format
module.exports = mongoose.model("Register", regiSchema);