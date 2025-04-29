const { body, validationResult } = require('express-validator');

const validateRestaurant = [
  body('name')
    .notEmpty().withMessage('El nombre del restaurante es obligatorio.')
    .isString().withMessage('El nombre del restaurante debe ser un texto.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      });
    }
    next();
  }
];

module.exports = validateRestaurant;