const express = require("express");
const router = express.Router();

// ✅ Import Controller
const CropR_Controller = require("../Controllers/CropR_Controllers");

// ✅ Define Routes
router.get("/", CropR_Controller.getAllCropR);
router.post("/", CropR_Controller.addCropR);
router.get("/:id", CropR_Controller.getById);  // ✅ Fixed: Changed from POST to GET
router.put("/:id", CropR_Controller.updateUser);  // ✅ Fixed: Changed from POST to GET
router.delete("/:id", CropR_Controller.deleteCropR);
// ✅ Export Router
module.exports = router;

