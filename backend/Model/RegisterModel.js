const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const regiSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    gmail: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cpassword: {
        type: String, // ✅ Use Date type
        required: true,
    },
    number: {
        type: Number, // ✅ Use Date type instead of String
        required: true,
    },
 
});

// ✅ Correct export format
module.exports = mongoose.model("Register", regiSchema);

