const { body, validationResult } = require('express-validator');

const validateSignup = [ // List of rules the controller has to follow
    body('id')
    .notEmpty().withMessage('ID is required')
    .isInt().withMessage('ID must be a number'),

    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid')
    .matches(/^[\w.+-]+@unisabana\.edu\.co$/).withMessage('Only @unisabana.edu.co emails are allowed'),

    body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('name')
    .notEmpty().withMessage('Name is required'),

    body('lastName')
    .notEmpty().withMessage('Last name is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
            errors: errors.array().map(err => ({
                field: err.param, 
                message: err.msg
                })),
            });
        } next();
    }
];

module.exports = validateSignup;