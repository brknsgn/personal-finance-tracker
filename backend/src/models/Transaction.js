const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0.01, "Amount must be greater than 0"]
    },
    type: {
        type: String,
        required: [true, "Type is required"],
        enum: {
            values: ["income", "expense"],
            message: "Type must be either 'income' or 'expense'"
        }
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    
    // WE CHANGED 'note' TO 'description' TO MATCH OUR REACT FRONTEND
    description: {
        type: String,
        // Updated the error message to say 'Description' instead of 'Note'
        maxlength: [200, "Description cannot exceed 200 characters"],
        trim: true
    },
    
    date: {
        type: Date,
        default: Date.now,
        max: [Date.now, "Date cannot be in the future"]
    }
}, {
    timestamps: true
}); 

module.exports = mongoose.model('Transaction', transactionSchema);