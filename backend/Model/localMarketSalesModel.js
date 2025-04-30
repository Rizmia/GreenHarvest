const { Schema, model } = require("mongoose");

const localIncomeSchema = new Schema({
    productName: {
        type: String,
        required: true,
    },
    quantitySold: {
        type: String, // Change to String because it will include "Kg", "g", etc.
        required: true,
    },
    pricePerUnit: {
        type: String, // Change to String to store the "Rs." format
        required: true,
    },
    BuyerName: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Bank Transfer", "Credit"],
        required: true,
    },
    dateOfSale: {
        type: Date,
        default: Date.now,
    },
    description: {
        type: String,
    },
    totalRevenue: {
        type: String, // Change to String to store the "Rs." format
        required: true,
    },
});

// Pre-save middleware to process the data before saving
localIncomeSchema.pre("save", function(next) {
    // Ensure totalRevenue has a value, remove the "Rs." prefix if it exists
    if (this.totalRevenue && this.totalRevenue.startsWith("Rs.")) {
        this.totalRevenue = this.totalRevenue.replace("Rs.", "").trim();
    } else if (!this.totalRevenue) {
        this.totalRevenue = "0"; // Set default value if it's empty or null
    }

    // Process pricePerUnit to remove "Rs." prefix
    if (this.pricePerUnit && this.pricePerUnit.startsWith("Rs.")) {
        this.pricePerUnit = this.pricePerUnit.replace("Rs.", "").trim();
    }

    // Process quantitySold field to handle "Kg", "g", etc.
    if (this.quantitySold && /[Kg|kg|G|g]$/.test(this.quantitySold)) {
        // Optional: handle any other processing here
    }

    next();
});

// Export the model correctly
module.exports = model("LocalMarketSales", localIncomeSchema);


