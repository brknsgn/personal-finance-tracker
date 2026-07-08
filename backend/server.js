// server.js

// 1. Load environment variables FIRST (Absolute path guarantee)
// This ensures the .env file is always found next to server.js, regardless of the terminal's current directory.
require('dotenv').config({ path: __dirname + '/.env' });

// 2. Import Express and the database connection
const express = require('express');
const connectDB = require('./src/config/db');  // Updated path to reflect the new folder structure
const cors = require('cors'); 
const morgan = require('morgan'); 
const rateLimit = require('express-rate-limit'); 
const swaggerUi = require('swagger-ui-express'); 
const YAML = require('yamljs'); 

// 3. Initialize the Express application
const app = express();
const swaggerDocument = YAML.load(__dirname + '/swagger.yaml');

// 4. Execute the database connection
connectDB();

// 5. GLOBAL MIDDLEWARE
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('dev')); // Log HTTP requests

// Configure rate limiting to prevent DDoS attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter); // Apply rate limiter globally

// Serve Swagger UI documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 

// Import routes (Updated paths for the new folder structure)
const transactions = require('./src/routes/transactionRoutes');
const categories = require('./src/routes/categoryRoutes');

// Mount routes
app.use('/transactions', transactions);
app.use('/categories', categories);

// 6. ROUTES
// Simple health check endpoint
app.get('/ping', (req, res) => {
    res.status(200).json({ 
        status: "ok", 
        message: "Express server is running smoothly!" 
    });
});

// 7. 404 HANDLER (Fallback Middleware)
// If no route matches the request, this middleware catches it and forwards a 404 error
app.use((req, res, next) => { 
    const error = new Error('Endpoint not found'); 
    error.statusCode = 404; // Attach status code for the error handler to read
    next(error); 
});

// 8. Error Handling Middleware
// This must be the last middleware in the stack
const errorHandler = require('./src/middlewares/errorMiddleware');
app.use(errorHandler);

// 9. START THE SERVER
// Start listening only if the application is run directly (prevents starting during tests)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the Express API for testing purposes
module.exports = app;