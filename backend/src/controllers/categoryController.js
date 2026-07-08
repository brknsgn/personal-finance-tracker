const Category = require('../models/Category');

// @desc    Create a new category
// @route   POST /categories
exports.createCategory = async (req, res, next) => {
    try {
        // Create the category in the database using the request body
        const category = await Category.create(req.body);
        
        // Return 201 Created status and the created data
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        // Pass the error to the centralized error handling middleware
        next(error); 
    }
};

// @desc    Get all categories
// @route   GET /categories
exports.getAllCategories = async (req, res, next) => {
    try {
        // Find all categories and sort them alphabetically by name
        const categories = await Category.find().sort({ name: 1 });
        
        // Return 200 OK status along with the count and data
        res.status(200).json({ 
            success: true, 
            count: categories.length, 
            data: categories 
        });
    } catch (error) {
        next(error); 
    }
};

// @desc    Get a single category by ID
// @route   GET /categories/:id
exports.getCategory = async (req, res, next) => {
    try {
        // Find a specific category by its ID
        const category = await Category.findById(req.params.id);

        // Check if the category exists
        if (!category) {
            const error = new Error('Category not found.');
            error.statusCode = 404;
            return next(error);
        }

        // Return 200 OK status and the found category
        res.status(200).json({ 
            success: true, 
            data: category 
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a single category by ID
// @route   PUT /categories/:id
exports.updateCategory = async (req, res, next) => {
    try {
        // Find category by ID and update it. 
        // 'new: true' ensures the updated document is returned.
        // 'runValidators: true' ensures model validation rules are applied.
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Check if the category exists
        if (!category) {
            const error = new Error('There is no category to update.'); 
            error.statusCode = 404;
            return next(error);
        }

        // Successfully return the updated category
        res.status(200).json({ 
            success: true, 
            data: category, 
            message: 'Category successfully updated.'
        }); 
    } catch(error) {
        next(error);
    }
};

// @desc    Delete a single category by ID
// @route   DELETE /categories/:id
exports.deleteCategory = async (req, res, next) => {
    try {
        // Find category by ID and remove it from the database
        const category = await Category.findByIdAndDelete(req.params.id);

        // Check if the category exists before attempting to delete
        if (!category) {
            const error = new Error('There is no category to delete.');
            error.statusCode = 404;
            return next(error);
        }

        // Return a success message upon deletion
        res.status(200).json({ 
            success: true, 
            message: 'Category successfully deleted.' 
        });
    } catch(error) {
        next(error);
    }
};