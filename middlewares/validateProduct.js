const { body, validationResult } = require('express-validator');

const validateProduct = [
    body('name')
        .notEmpty().withMessage('Product name is required'),

    body('description')
        .notEmpty().withMessage('Product description is required'),

    body('price')
        .notEmpty().withMessage('Product price is required')
        .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),

    body('imageUrl')
        .notEmpty().withMessage('Product image URL is required')
        .isURL().withMessage('Image URL must be valid'),

    body('quantity')
        .notEmpty().withMessage('Product quantity is required')
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),

    body('categories')
        .isArray({ min: 1 }).withMessage('At least one category is required'),

    body('available')
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

module.exports = validateProduct;