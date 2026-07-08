const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true, // Ensures that each category name is unique
        trim: true
    },
    color: {
        type: String,
        required: [true, "Category color is required"],
        default: "#000000", // Default color is white
    
    },
    monthlyBudgetLimit: {
        type: Number,
        default: 0, // Default budget limit is 0, meaning no limit
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Category', CategorySchema);
    