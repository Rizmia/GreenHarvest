const express = require("express");
const router = express.Router();

const { 
    getAllLocalIncome, 
    addLocalIncome, 
    getById, 
    updatelocalincome, 
    deletelocalincome,
    getMonthlyRevenue 
} = require("../controllers/localMarketSalesController");

// Define Routes
router.get("/", getAllLocalIncome);
router.post("/", addLocalIncome);
router.get("/:id", getById);
router.put("/:id", updatelocalincome);
router.delete("/:id", deletelocalincome);
router.get("/monthly/revenue", getMonthlyRevenue);

module.exports = router;