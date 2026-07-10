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
app.use(cors());// Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests 
app.use(morgan('dev')); // Log HTTP requests
// backend/server.js (veya routes dosyan)

app.get('/export/csv', async (req, res) => {
  try {
    // 1. Fetch all transactions from the database. Sort by newest first (-1).
    const transactions = await Transaction.find().sort({ date: -1 });

    // 2. Define the CSV header row exactly as we want it to appear in Excel.
    // \n means "move to the next line" (Enter key).
    let csvString = 'Description,Amount,Type,Category,Date\n';

    // 3. Loop through each transaction and format it as a CSV row.
    transactions.forEach((t) => {
      // Wrap description in quotes ("") to prevent accidental commas inside the text from breaking the columns.
      const desc = `"${t.description || 'No Description'}"`;
      const amount = t.amount;
      const type = t.type;
      const category = t.category;
      
      // Format the date to a readable local string (e.g., 10.07.2026).
      const date = new Date(t.date || t.createdAt).toLocaleDateString('tr-TR');
      
      // Append the new row to our main csv string, separating values with commas.
      csvString += `${desc},${amount},${type},${category},${date}\n`;
    });

    // 4. Set the exact headers to force the browser to trigger a file download.
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');

    // 5. Send the raw CSV string directly to the client.
    res.status(200).send(csvString);

  } catch (error) {
    console.error('CSV Export Error:', error);
    res.status(500).json({ message: "Failed to export CSV." });
  }
});

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
const Transaction = require('./src/models/Transaction');
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