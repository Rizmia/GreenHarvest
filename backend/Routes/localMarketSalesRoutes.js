/*const express = require("express");
const router = express.Router();

// Import Controller
const { getAllLocalIncome, addLocalIncome, getById, updatelocalincome, deletelocalincome } = require("../Controllers/localMarketSalesController");

// Define Routes
router.get("/", getAllLocalIncome);
router.post("/", addLocalIncome);
router.get("/:id", getById);
router.put("/:id", updatelocalincome);
router.delete("/:id", deletelocalincome);


// Export Router
module.exports = router;*/


const express = require("express");
const router = express.Router();

const { 
    getAllLocalIncome, 
    addLocalIncome, 
    getById, 
    updatelocalincome, 
    deletelocalincome,
    getMonthlyRevenue 
} = require("../Controllers/localMarketSalesController");

// Define Routes
router.get("/", getAllLocalIncome);
router.post("/", addLocalIncome);
router.get("/:id", getById);
router.put("/:id", updatelocalincome);
router.delete("/:id", deletelocalincome);
router.get("/monthly/revenue", getMonthlyRevenue);

module.exports = router;
