const express = require("express");
const router = express.Router();
const CropR_Controller = require("../controllers/CropR_Controllers");

router.get("/", CropR_Controller.getAllCropR);
router.post("/", CropR_Controller.addCropR);
router.get("/:id", CropR_Controller.getById);
router.put("/:id", CropR_Controller.updateUser);
router.delete("/:id", CropR_Controller.deleteCropR);

module.exports = router;