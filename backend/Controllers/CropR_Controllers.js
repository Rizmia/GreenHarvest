// const CropR = require("../Model/CropR_Model"); // ✅ Correct import

// // ✅ Get all crop records
// const getAllCropR = async (req, res, next) => {
//     let crops;
//     try {
//         crops = await CropR.find();  
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Database query error" });
//     }

//     if (!crops || crops.length === 0) {
//         return res.status(404).json({ message: "No crop records found" });
//     }

//     return res.status(200).json({ crops });
// };

// // ✅ Add a new crop record
// const addCropR = async (req, res, next) => {
//     const { crop_name, crop_quantity, soil_type, planting_date, harvest_time, 
//             Fertilizer_Type, Fertilizer_quantity, Water_Requirement, Expected_Yield, Weather_Conditions } = req.body;

//     let cropRecord;
//     try {
//         cropRecord = new CropR({  
//             crop_name, 
//             crop_quantity, 
//             soil_type,
//             planting_date, 
//             harvest_time, 
//             Fertilizer_Type, 
//             Fertilizer_quantity, 
//             Water_Requirement, 
//             Expected_Yield, 
//             Weather_Conditions
//         });
//         await cropRecord.save();
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Error saving crop record" });
//     }

//     if (!cropRecord) {
//         return res.status(400).json({ message: "Unable to add crop record" });
//     }

//     return res.status(201).json({ cropRecord });
// };

// // ✅ Get crop record by ID
// const getById =  async (req, res, next) => {
//     const id = req.params.id;
//     let cropRecord;

//     try {
//         cropRecord = await CropR.findById(id);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: "Database query error" });
//     }

//     // Not available crop records
//     if (!cropRecord) {
//         return res.status(404).json({ message: "Crop record not found" });
//     }

//     return res.status(200).json({ cropRecord }); 
// };
// //Update ser details
// const updateUser = async (req , res , next) =>{
//     const id = req.params.id;
//     const { crop_name, crop_quantity, soil_type, planting_date, harvest_time, 
//         Fertilizer_Type, Fertilizer_quantity, Water_Requirement, Expected_Yield, Weather_Conditions } = req.body;

//         let cropRecord;

//         try{
//             cropRecord = await CropR.findByIdAndUpdate(id,
//                { crop_name: crop_name, 
//                 crop_quantity: crop_quantity, 
//                 soil_type : soil_type,
//                 planting_date : planting_date, 
//                 harvest_time : harvest_time, 
//                 Fertilizer_Type : Fertilizer_Type, 
//                 Fertilizer_quantity : Fertilizer_quantity, 
//                 Water_Requirement : Water_Requirement, 
//                 Expected_Yield : Expected_Yield, 
//                 Weather_Conditions : Weather_Conditions}
//             );
//             cropRecord = await cropRecord.save();
//         } catch(err){
//             console.log(err);
//         }
//          // Not available crop records
//     if (!cropRecord) {
//         return res.status(404).json({ message: "Unable to update Crop records" });
//     }

//     return res.status(200).json({ cropRecord }); 

// };
// //Delete User Details
// const deleteCropR = async (req,res, next) =>{
//     const id = req.params.id;
//     let cropRecord;

//     try{
//         cropRecord = await CropR.findByIdAndDelete(id)

//     }catch (err){
//         console.log(err);
//     }

//     if (!cropRecord) {
//         return res.status(404).json({ message: "Unable to delete Crop records" });
//     }

//     return res.status(200).json({ cropRecord }); 
// };
// // ✅ Export functions
// exports.getAllCropR = getAllCropR;
// exports.addCropR = addCropR;
// exports.getById = getById;
// exports.updateUser = updateUser;
// exports.deleteCropR = deleteCropR;

const CropR = require("../Model/CropR_Model");

const getAllCropR = async (req, res, next) => {
  let crops;
  try {
    crops = await CropR.find();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database query error" });
  }

  if (!crops || crops.length === 0) {
    return res.status(404).json({ message: "No crop records found" });
  }

  return res.status(200).json({ crops });
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

  let cropRecord;
  try {
    cropRecord = new CropR({
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error saving crop record" });
  }

  if (!cropRecord) {
    return res.status(400).json({ message: "Unable to add crop record" });
  }

  return res.status(201).json({ cropRecord });
};

const getById = async (req, res, next) => {
  const id = req.params.id;
  let cropRecord;
  try {
    cropRecord = await CropR.findById(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Database query error" });
  }

  if (!cropRecord) {
    return res.status(404).json({ message: "Crop record not found" });
  }

  return res.status(200).json({ cropRecord });
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

  let cropRecord;
  try {
    cropRecord = await CropR.findByIdAndUpdate(
      id,
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
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error updating crop record" });
  }

  if (!cropRecord) {
    return res.status(404).json({ message: "Unable to update crop records" });
  }

  return res.status(200).json({ cropRecord });
};

const deleteCropR = async (req, res, next) => {
  const id = req.params.id;
  let cropRecord;
  try {
    cropRecord = await CropR.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting crop record" });
  }

  if (!cropRecord) {
    return res.status(404).json({ message: "Unable to delete crop records" });
  }

  return res.status(200).json({ cropRecord });
};

exports.getAllCropR = getAllCropR;
exports.addCropR = addCropR;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteCropR = deleteCropR;