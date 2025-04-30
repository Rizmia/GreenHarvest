/*const express = require("express");
const router = express.Router();

// Import Controller
const { getAllExportIncome, addExportIncome, getById, updateExportincome, deleteExportincome } = require("../Controllers/ExportSalesController");

// Define Routes
router.get("/", getAllExportIncome);
router.post("/", addExportIncome);
router.get("/:id", getById);
router.put("/:id", updateExportincome);
router.delete("/:id", deleteExportincome);


// Export Router
module.exports = router;*/


const express = require("express");
const router = express.Router();

const { 
    getAllExportIncome, 
    addExportIncome, 
    getById, 
    updateExportincome, 
    deleteExportincome,
    getMonthlyExportRevenue 
} = require("../Controllers/ExportSalesController");

// Define Routes
router.get("/", getAllExportIncome);
router.post("/", addExportIncome);
router.get("/:id", getById);
router.put("/:id", updateExportincome);
router.delete("/:id", deleteExportincome);
router.get("/monthly/revenue", getMonthlyExportRevenue);

module.exports = router;
