// src/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();

const { 
    getTransactions, 
    createTransaction, 
    getTransaction, 
    updateTransaction, 
    deleteTransaction,
    getSummary // Make sure to import the new summary function!
} = require('../controllers/transactionController');

// 1. Standard Routes
router.route('/')
    .get(getTransactions)
    .post(createTransaction);

// 2. STATIC ROUTES
// This route is static and does not require an ID parameter. It will provide a summary of all transactions.
router.route('/summary')
    .get(getSummary);

// 3. DYNAMIC ROUTES 
// These routes require an ID parameter to identify a specific transaction.
router.route('/:id')
    .get(getTransaction)
    .put(updateTransaction)
    .delete(deleteTransaction);

module.exports = router;