const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CropRSchema = new Schema({
  crop_name: { type: String, required: true },
  crop_quantity: { type: Number, required: true },
  soil_type: { type: String, required: true },
  planting_date: { type: Date, required: true },
  harvest_time: { type: Date, required: true },
  Fertilizer_Type: { type: String, required: true },
  Fertilizer_quantity: { type: Number, required: true },
  Water_Requirement: { type: String, required: true },
  Expected_Yield: { type: String, required: true },
  Weather_Conditions: { type: String, required: true },
  customFields: { type: Map, of: String, default: {} }, // Dynamic fields stored as key-value pairs
});

module.exports = mongoose.model("CropR", CropRSchema);