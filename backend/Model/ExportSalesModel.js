const { Schema, model } = require("mongoose");

const exportIncomeSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    quantityExported: {
        type: String, 
        required: true,
    },
    exportedPrice: {
        type: String, 
        required: true,
    },
    destinationCtry: {
        type: String,
        required: true,
    },
    exportedCompany: {
        type: String,
        required: true,
    },
    shipping_CustomCost: {
        type: String,
        required: true,
    },
    dateOfExported: {
        type: Date,
        default: Date.now,
    },
    totalExportRevenue: {
        type: String, 
        required: true,
    },
});



// Export the model correctly
module.exports = model("ExportSales", exportIncomeSchema);


