// src/middlewares/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Log the error for the developer in the console
    console.error(err.stack);

    const statusCode = err.statusCode || 500; // Default to 500 if no status code is set

    // Set a default status code (500 Internal Server Error) if none is provided

    

    // Send a unified, consistent JSON response
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Server Error',

        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;