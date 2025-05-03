const express = require("express");
const router = express.Router();

const { 
    getAllExportIncome, 
    addExportIncome, 
    getById, 
    updateExportincome, 
    deleteExportincome,
    getMonthlyExportRevenue 
} = require("../controllers/ExportSalesController");

// Define Routes
router.get("/", getAllExportIncome);
router.post("/", addExportIncome);
router.get("/:id", getById);
router.put("/:id", updateExportincome);
router.delete("/:id", deleteExportincome);
router.get("/monthly/revenue", getMonthlyExportRevenue);

module.exports = router;