const exportIncome = require('../models/ExportSalesModel');

// Get all Export Income records
const getAllExportIncome = async (req, res, next) => {
    let incomes;
    try {
        incomes = await exportIncome.find();
    } catch (err) {
        console.error(err);
    }

    if (!incomes) {
        return res.status(404).json({ message: "No Export Income Records Found" });
    }
    return res.status(200).json(incomes);
};

// Add new Export Income
const addExportIncome = async (req, res, next) => {
    const { 
        productName, 
        quantityExported, 
        exportedPrice, 
        destinationCtry, 
        exportedCompany, 
        shipping_CustomCost, 
        dateOfExported, 
        totalExportRevenue 
    } = req.body;

    let income;
    try {
        income = new exportIncome({
            productName,
            quantityExported,
            exportedPrice,
            destinationCtry,
            exportedCompany,
            shipping_CustomCost,
            dateOfExported,
            totalExportRevenue
        });
        await income.save();
    } catch (err) {
        console.error(err);
    }

    if (!income) {
        return res.status(500).json({ message: "Unable to Add Export Income" });
    }
    return res.status(201).json({ income });
};

// Get Export Income by ID
const getById = async (req, res, next) => {
    const id = req.params.id;

    let income;
    try {
        income = await exportIncome.findById(id);
    } catch (err) {
        console.error(err);
    }

    if (!income) {
        return res.status(404).json({ message: "Export Income Record Not Found" });
    }
    return res.status(200).json({ income });
};

// Update Export Income
const updateExportincome = async (req, res, next) => {
    const id = req.params.id;
    const { 
        productName, 
        quantityExported, 
        exportedPrice, 
        destinationCtry, 
        exportedCompany, 
        shipping_CustomCost, 
        dateOfExported, 
        totalExportRevenue 
    } = req.body;

    let income;
    try {
        income = await exportIncome.findByIdAndUpdate(id, {
            productName,
            quantityExported,
            exportedPrice,
            destinationCtry,
            exportedCompany,
            shipping_CustomCost,
            dateOfExported,
            totalExportRevenue
        }, { new: true });
    } catch (err) {
        console.error(err);
    }

    if (!income) {
        return res.status(404).json({ message: "Unable to Update Export Income by this ID" });
    }
    return res.status(200).json({ income });
};

// Delete Export Income
const deleteExportincome = async (req, res, next) => {
    const id = req.params.id;

    let income;
    try {
        income = await exportIncome.findByIdAndDelete(id);
    } catch (err) {
        console.error(err);
    }

    if (!income) {
        return res.status(404).json({ message: "Unable to Delete Export Income by this ID" });
    }
    return res.status(200).json({ message: "Export Income Successfully Deleted" });
};

// Monthly Export Revenue Analysis (for chart)
const getMonthlyExportRevenue = async (req, res, next) => {
    try {
        // First approach - using aggregation pipeline
        let monthlyRevenue;
        try {
            monthlyRevenue = await exportIncome.aggregate([
                {
                    $addFields: {
                        numericRevenue: {
                            $convert: {
                                input: {
                                    $trim: {
                                        input: {
                                            $toString: "$totalExportRevenue"
                                        },
                                        chars: "Rs."
                                    }
                                },
                                to: "double",
                                onError: 0,
                                onNull: 0
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$dateOfExported" },
                            month: { $month: "$dateOfExported" }
                        },
                        total: { $sum: "$numericRevenue" },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                {
                    $project: {
                        _id: 0,
                        year: "$_id.year",
                        month: "$_id.month",
                        total: { $round: ["$total", 2] },
                        count: 1
                    }
                }
            ]);
        } catch (aggError) {
            console.log("Aggregation failed, trying manual approach:", aggError);
            
            // Fallback manual approach
            const allExports = await exportIncome.find({});
            const manualGrouping = {};
            
            allExports.forEach(item => {
                if (!item.dateOfExported) return;
                
                const date = new Date(item.dateOfExported);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const key = `${year}-${month}`;
                
                let revenueValue = 0;
                if (typeof item.totalExportRevenue === 'string') {
                    revenueValue = parseFloat(item.totalExportRevenue.replace('Rs.', '').trim()) || 0;
                } else {
                    revenueValue = Number(item.totalExportRevenue) || 0;
                }
                
                if (!manualGrouping[key]) {
                    manualGrouping[key] = { year, month, total: 0, count: 0 };
                }
                
                manualGrouping[key].total += revenueValue;
                manualGrouping[key].count++;
            });
            
            monthlyRevenue = Object.values(manualGrouping)
                .sort((a, b) => a.year - b.year || a.month - b.month);
        }

        console.log("Monthly Revenue Data:", monthlyRevenue);
        
        if (!monthlyRevenue || monthlyRevenue.length === 0) {
            return res.status(404).json({ 
                message: "No export revenue data available",
                suggestion: "Please add some export income records with valid dates"
            });
        }

        res.status(200).json(monthlyRevenue);
    } catch (err) {
        console.error("Error in getMonthlyExportRevenue:", err);
        return res.status(500).json({ 
            message: "Server Error",
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

module.exports = {
    getAllExportIncome,
    addExportIncome,
    getById,
    updateExportincome,
    deleteExportincome,
    getMonthlyExportRevenue
};