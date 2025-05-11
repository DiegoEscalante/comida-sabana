const { body, validationResult } = require('express-validator');

const validateUpdateProduct = [
    body('name')
        .optional() 
        .notEmpty().withMessage('Product name is required'), // Only validates if provided

    body('description')
        .optional()
        .notEmpty().withMessage('Product description is required'),

    body('price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

    body('imageUrl')
        .optional()
        .isURL().withMessage('Image URL must be valid'),

    body('quantity')
        .optional()
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),

    body('categories')
        .optional()
        .isArray({ min: 1 }).withMessage('At least one category is required'),

    body('available')
        .optional()
        .isBoolean().withMessage('Available must be a boolean value'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array().map(err => ({
                    field: err.param,
                    message: err.msg
                })),
            });
        }
        next();
    }
];

module.exports = validateUpdateProduct;