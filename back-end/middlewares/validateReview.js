const { body, validationResult } = require('express-validator');
const { Types } = require('mongoose');

const validateReview = [
  body('orderId')
    .notEmpty().withMessage('El ID de la orden es obligatorio.')
    .custom(value => {
      if (!Types.ObjectId.isValid(value)) {
        throw new Error('El ID de orden no es válido.');
      }
      return true;
    }),

  body('score')
    .notEmpty().withMessage('La calificación (score) es obligatoria.')
    .isNumeric().withMessage('La calificación debe ser un número.')
    .custom(value => {
      if (value < 1 || value > 5) {
        throw new Error('La calificación debe estar entre 1 y 5.');
      }
      return true;
    }),

  body('comment')
    .optional()
    .isString().withMessage('El comentario debe ser un texto.'),

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

module.exports = validateReview;