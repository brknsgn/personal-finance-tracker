// server.js

// 1. Load environment variables FIRST
require('dotenv').config()

// 2. Import Express and the database connection
const express = require('express'); // Import the Express framework to create the server
const connectDB = require('./src/config/db');  // Import the database connection function to connect to MongoDB
const cors = require('cors'); // Import CORS middleware to handle cross-origin requests
const morgan = require('morgan'); // Import Morgan middleware for logging HTTP requests
const rateLimit = require('express-rate-limit'); // Import rate limiting middleware to prevent abuse and DDoS attacks
const swaggerUi = require('swagger-ui-express'); // Import Swagger UI middleware to serve API documentation
const YAML = require('yamljs'); // Import YAML parser to load the Swagger documentation from a YAML file



// 3. Initialize the Express application
const app = express();
const swaggerDocument = YAML.load('./swagger.yaml'); // Load the Swagger YAML file


// 4. Execute the database connection
connectDB();

// 5. GLOBAL MIDDLEWARE
// This allows our app to accept and parse incoming JSON data in the request body
app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(morgan('dev')); // Log HTTP requests to the console for easier debugging
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter); // Apply rate limiting to all requests
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); // Serve Swagger UI at /api-docs
// Import routes
const transactions = require('./src/routes/transactionRoutes');
const categories = require('./src/routes/categoryRoutes');

// Mount routes
app.use('/transactions', transactions);
app.use('/categories', categories);

// 6. ROUTES
// Express replaces the if/else logic with clean routing methods (app.get, app.post, etc.)
app.get('/ping', (req, res) => {
    // Sending a response is much simpler now
    res.status(200).json({ 
        status: "ok", 
        message: "Express server is running smoothly!" 
    });
});

// 7. 404 HANDLER (Fallback Middleware)
// If the incoming request doesn't match any route above, it falls down to this middleware
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// 8. Error Handling Middleware
const errorHandler = require('./src/middlewares/errorMiddleware');


// 8.2. Mount the 404 fallback
app.use((req, res, next) => { // If no route matches, this middleware will be called
    const error = new Error('Endpoint not found'); // Create a new error object with a message
    res.status(404); // Set the response status to 404 (Not Found)
    next(error); // Pass this 404 error down to the error handler
});

// START THE SERVER
app.use(errorHandler);

// Start the server only if this file is run directly (not imported for testing)
// Eğer dosya doğrudan çalıştırılıyorsa (test edilmiyorsa) sunucuyu başlat
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app; // Testler için app'i dışa aktar



