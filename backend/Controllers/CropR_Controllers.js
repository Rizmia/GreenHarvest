const CropR = require("../Model/CropR_Model");

const getAllCropR = async (req, res, next) => {
  try {
    // Filter crops by authenticated user's ID
    const crops = await CropR.find({ userId: req.user.userId });
    if (!crops || crops.length === 0) {
      return res.status(404).json({ message: "No crop records found" });
    }
    return res.status(200).json({ crops });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database query error" });
  }
};

const addCropR = async (req, res, next) => {
  const {
    crop_name,
    crop_quantity,
    soil_type,
    planting_date,
    harvest_time,
    Fertilizer_Type,
    Fertilizer_quantity,
    Water_Requirement,
    Expected_Yield,
    Weather_Conditions,
    customFields = {},
  } = req.body;

  try {
    const cropRecord = new CropR({
      userId: req.user.userId, // Associate with authenticated user
      crop_name,
      crop_quantity,
      soil_type,
      planting_date,
      harvest_time,
      Fertilizer_Type,
      Fertilizer_quantity,
      Water_Requirement,
      Expected_Yield,
      Weather_Conditions,
      customFields,
    });
    await cropRecord.save();
    return res.status(201).json({ cropRecord });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error saving crop record" });
  }
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const cropRecord = await CropR.findOne({ _id: id, userId: req.user.userId });
    if (!cropRecord) {
      return res.status(404).json({ message: "Crop record not found or unauthorized" });
    }
    return res.status(200).json({ cropRecord });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Database query error" });
  }
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const {
    crop_name,
    crop_quantity,
    soil_type,
    planting_date,
    harvest_time,
    Fertilizer_Type,
    Fertilizer_quantity,
    Water_Requirement,
    Expected_Yield,
    Weather_Conditions,
    customFields,
  } = req.body;

  try {
    const cropRecord = await CropR.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      {
        crop_name,
        crop_quantity,
        soil_type,
        planting_date,
        harvest_time,
        Fertilizer_Type,
        Fertilizer_quantity,
        Water_Requirement,
        Expected_Yield,
        Weather_Conditions,
        customFields,
      },
      { new: true }
    );
    if (!cropRecord) {
      return res.status(404).json({ message: "Crop record not found or unauthorized" });
    }
    return res.status(200).json({ cropRecord });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating crop record" });
  }
};

const deleteCropR = async (req, res, next) => {
  const id = req.params.id;
  try {
    const cropRecord = await CropR.findOneAndDelete({ _id: id, userId: req.user.userId });
    if (!cropRecord) {
      return res.status(404).json({ message: "Crop record not found or unauthorized" });
    }
    return res.status(200).json({ cropRecord });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error deleting crop record" });
  }
};

exports.getAllCropR = getAllCropR;
exports.addCropR = addCropR;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteCropR = deleteCropR;




