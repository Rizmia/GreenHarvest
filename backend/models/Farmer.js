const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  question: { type: String, required: true },
  lat: { type: Number },
  lon: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Farmer', farmerSchema);