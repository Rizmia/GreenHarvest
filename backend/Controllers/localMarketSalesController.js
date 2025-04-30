/*const localIncome = require("../Model/localMarketSalesModel");

// Data display
const getAllLocalIncome = async (req, res, next) => {
    try {
        const localIncomes = await localIncome.find();

        if (!localIncomes || localIncomes.length === 0) {
            return res.status(404).json({ message: "Income not found" });
        }

        res.status(200).json(localIncomes);  // Directly return the array
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};


// Data insert
const addLocalIncome = async (req, res, next) => {
    const { productName, quantitySold, pricePerUnit, BuyerName, paymentMethod, dateOfSale, description, totalRevenue } = req.body;

    let newIncome;

    try {
        newIncome = new localIncome({ productName, quantitySold, pricePerUnit, BuyerName, paymentMethod, dateOfSale, description, totalRevenue });
        await newIncome.save();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add local income" });
    }

    return res.status(201).json({ message: "Local income added successfully", newIncome });
};

//Get by Id
const getById = async (req, res,next) => {

    const id = req.params.id;

    let localincome;

    try {
        localincome = await localIncome.findById(id);
    }catch (err) {
        console.log(err);
    }
    //not available local income 
    if (!localincome) {
        return res.status(404).json({ message: "Local income not found"});
    }
    return res.status(200).json({ localincome  });
};

//Update local income
const updatelocalincome = async (req, res, next) => {
    const id = req.params.id;  // Fixed req.params.id
    const { productName, quantitySold, pricePerUnit, BuyerName, paymentMethod, dateOfSale, description, totalRevenue } = req.body;

    let localincome;

    try {
        localincome = await localIncome.findByIdAndUpdate(
            id,
            { productName, quantitySold, pricePerUnit, BuyerName, paymentMethod, dateOfSale, description, totalRevenue },
            { new: true }  // Ensure the updated document is returned
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!localincome) {
        return res.status(404).json({ message: "Unable to update local income details. ID not found." });
    }

    return res.status(200).json({ message: "Local income updated successfully", localincome });
};

//Delete local income Details
const deletelocalincome = async (req, res, next) => {
    const id = req.params.id;

    let localincome;

    try {
        localincome = await localIncome.findByIdAndDelete(id)
    }catch (err) {
        console.log(err);
    }
    if (!localincome) {
        return res.status(404).json({ message: "Unable to delete lcal income details."});
    }
    return res.status(200).json({ localincome});
}


// Properly export both functions
module.exports = { getAllLocalIncome, addLocalIncome, getById, updatelocalincome, deletelocalincome };*/



const localIncome = require("../Model/localMarketSalesModel");

// Data display
const getAllLocalIncome = async (req, res, next) => {
    try {
        const localIncomes = await localIncome.find();

        if (!localIncomes || localIncomes.length === 0) {
            return res.status(404).json({ message: "Income not found" });
        }

        res.status(200).json(localIncomes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

// Data insert
const addLocalIncome = async (req, res, next) => {
    const { productName, quantitySold, pricePerUnit, BuyerName, paymentMethod, dateOfSale, description, totalRevenue } = req.body;

    let newIncome;

    try {
        newIncome = new localIncome({ productName, quantitySold, pricePerUnit, BuyerName, paymentMethod, dateOfSale, description, totalRevenue });
        await newIncome.save();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to add local income" });
    }

    return res.status(201).json({ message: "Local income added successfully", newIncome });
};

// Get by Id
const getById = async (req, res, next) => {
    const id = req.params.id;
    let localincome;

    try {
        localincome = await localIncome.findById(id);
    } catch (err) {
        console.log(err);
    }

    if (!localincome) {
        return res.status(404).json({ message: "Local income not found"});
    }
    return res.status(200).json({ localincome });
};

// Update local income
const updatelocalincome = async (req, res, next) => {
    const id = req.params.id;
    const { productName, quantitySold, pricePerUnit, BuyerName, paymentMethod, dateOfSale, description, totalRevenue } = req.body;

    let localincome;

    try {
        localincome = await localIncome.findByIdAndUpdate(
            id,
            { productName, quantitySold, pricePerUnit, BuyerName, paymentMethod, dateOfSale, description, totalRevenue },
            { new: true }
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!localincome) {
        return res.status(404).json({ message: "Unable to update local income details. ID not found." });
    }

    return res.status(200).json({ message: "Local income updated successfully", localincome });
};

// Delete local income Details
const deletelocalincome = async (req, res, next) => {
    const id = req.params.id;
    let localincome;

    try {
        localincome = await localIncome.findByIdAndDelete(id);
    } catch (err) {
        console.log(err);
    }
    if (!localincome) {
        return res.status(404).json({ message: "Unable to delete local income details."});
    }
    return res.status(200).json({ localincome });
}

// Monthly Revenue Analysis
const getMonthlyRevenue = async (req, res, next) => {
    try {
        const monthlyRevenue = await localIncome.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$dateOfSale" },
                        month: { $month: "$dateOfSale" }
                    },
                    total: { 
                        $sum: { 
                            $toDouble: { 
                                $ifNull: [ 
                                    { $trim: { input: "$totalRevenue", chars: "Rs." } }, 
                                    "0" 
                                ] 
                            } 
                        } 
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    total: 1,
                    count: 1
                }
            }
        ]);

        res.status(200).json(monthlyRevenue);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { 
    getAllLocalIncome, 
    addLocalIncome, 
    getById, 
    updatelocalincome, 
    deletelocalincome,
    getMonthlyRevenue 
};
