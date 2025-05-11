const { Types } = require('mongoose');

const validateReview = (req, res, next) => {
    const { userId, restaurantId, orderId, score, comment } = req.body;

    // Verificar que todos los campos existen
    if (!userId || !restaurantId || !orderId || score === undefined || comment === undefined) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios: userId, restaurantId, orderId, score, comment.' });
    }

    // Validar que los IDs sean ObjectId válidos
    if (![userId, restaurantId, orderId].every(Types.ObjectId.isValid)) {
        return res.status(400).json({ message: 'Uno o más IDs no son válidos.' });
    }

    // Validar que el score sea un número entre 1 y 5
    const parsedScore = Number(score);
    if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 5) {
        return res.status(400).json({ message: 'El puntaje (score) debe ser un número entre 1 y 5.' });
    }

    // Validar que el comentario no esté vacío
    if (comment !== undefined && typeof comment !== 'string') {
        return res.status(400).json({ message: 'El comentario debe ser un texto si se proporciona.' });
    }
    
    // Si todo está bien, continuar
    next();
};

module.exports = validateReview;