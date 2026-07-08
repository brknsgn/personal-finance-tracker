
const Transaction = require('../models/Transaction'); // Import the Transaction model to interact with the database

// @desc    Get all transactions with pagination
// @route   GET /transactions
exports.getTransactions = async (req, res,next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not provided

        const skip = (page - 1) * limit; // Calculate how many documents to skip based on the current page and limit

        const transactions = await Transaction.find()
        .populate('category', 'name color') // Populate the category field with its name and color
        .sort({ date: -1 }) // Sort transactions by date in descending order (most recent first)
        .skip(skip) // Skip the appropriate number of documents for pagination
        .limit(limit); // Fetch transactions with pagination and sort by date in descending order
        const total = await Transaction.countDocuments(); // Get the total number of transactions
        
        res.status(200).json({ // Send a structured response with pagination info
            success: true,
            count: transactions.length,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: transactions // Return the fetched transactions
        });
    } catch (error) {
       next(error); // Pass the error to the centralized middleware
    }
};

// @desc    Add a new transaction
// @route   POST /transactions
exports.createTransaction = async (req, res, next) => {
    try {
        // Attempt to create a transaction using the incoming body
        const transaction = await Transaction.create(req.body);

        // If successful, return the created object with a 201 (Created) status
        res.status(201).json({
            success: true,
            data: transaction
        });
    } // ...
  catch (error) { // Catch any errors that occur during the creation process
    next(error);  // Pass the error to the centralized middleware for consistent error handling
}
    
};

// @desc    Get a single transaction
// @route   GET /transactions/:id
exports.getTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        next(error); // Pass the error to the centralized middleware
    }
};

// @desc    Update a transaction
// @route   PUT /transactions/:id
exports.updateTransaction = async (req, res, next) => {
    try {
        const allowedUpdates = ['amount', 'type', 'category', 'note', 'date']; // Define which fields are allowed to be updated
        
        const updateData = {}; // Initialize an empty object to hold the valid updates
        for (const key of Object.keys(req.body)) {
            if (allowedUpdates.includes(key)) {
                updateData[key] = req.body[key]; // Only add the field to updateData if it's in the allowedUpdates list
            }
        }

        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id, 
            updateData, { 
                new: true, 
                runValidators: true }); // Find the transaction by ID and update it with the new data, returning the updated document and running validators
        if (!transaction) {
            const error = new Error('Transaction not found'); // Create a new error object with a message indicating the transaction was not found
            error.statusCode = 404; // Set the status code to 404 (Not Found)
            return next(error);

        }
        res.status(200).json({ success: true, data: transaction }); // Return the updated transaction with a 200 (OK) status
    } catch (error) {
        next(error); // Pass the error to the centralized middleware
    }   

};

// @desc    Delete a transaction
// @route   DELETE /transactions/:id
exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'Transaction not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};



// @desc    Get summary of transactions (income, expense, balance, category totals)
// @route   GET /transactions/summary 
exports.getSummary = async (req, res, next) => {
    try {
        // 1. Calculate overall income and expense
        const totals = await Transaction.aggregate([
            {
                $group: {
                    _id: "$type", // Group documents by 'income' or 'expense'
                    totalAmount: { $sum: "$amount" } // Accumulate the 'amount' field
                }
            }
        ]);

        // Transform the array response into simple variables
        let income = 0;
        let expense = 0;

        totals.forEach(item => {
            if (item._id === 'income') income = item.totalAmount;
            if (item._id === 'expense') expense = item.totalAmount;
        });

        const balance = income - expense;

        // 2. Calculate expenses grouped by category
        const categoryExpenses = await Transaction.aggregate([
            {
                $match: { type: 'expense' } // Filter: Only process expenses
            },
            {
                $group: {
                    _id: "$category", // Group by the category name
                    totalSpent: { $sum: "$amount" } // Add up the amounts
                }
            },
            {
                $sort: { totalSpent: -1 } // Sort by totalSpent in descending order
            }
        ]);

        // Send the final compiled object back to the client
        res.status(200).json({
            success: true,
            data: {
                income,
                expense,
                balance,
                categoryExpenses
            }
        });
    } catch (error) {
        next(error);
    }
};