const { Types } = require('mongoose');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

const createReview = async (req, res) => {
    try {
        const { userId, restaurantId, orderId, score, comment } = req.body;

        // Verificar existencia de entidades
        const [user, restaurant, order] = await Promise.all([
            User.findById(userId),
            Restaurant.findById(restaurantId),
            Order.findById(orderId)
        ]);

        if (!user || !restaurant || !order) {
            return res.status(404).json({ message: 'Usuario, restaurante u orden no encontrados.' });
        }

        // Verificar integridad de la orden
        if (!order.userId.equals(userId) || !order.restaurantId.equals(restaurantId)) {
            return res.status(403).json({ message: 'La orden no pertenece al usuario o restaurante.' });
        }

        // Revisar si ya hay reseña para esta orden
        const existingReview = await Review.findOne({ orderId });
        if (existingReview) {
            return res.status(409).json({ message: 'Ya existe una reseña para esta orden.' });
        }

        // Crear y guardar reseña
        const review = new Review({ userId, restaurantId, orderId, score, comment });
        const savedReview = await review.save();

        // 🔁 ACTUALIZAR número de reseñas y score promedio del restaurante
        const newTotalReviews = restaurant.numberOfReviews + 1;
        const newAverageScore = ((restaurant.averageScore * restaurant.numberOfReviews) + score) / newTotalReviews;

        restaurant.numberOfReviews = newTotalReviews;
        restaurant.averageScore = newAverageScore;

        await restaurant.save();

        // 🔚 Enviar respuesta
        res.status(201).json(savedReview);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reseña.' });
    }
};

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('userId', 'name') 
            .sort({ createdAt: -1 });   

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las reseñas.' });
    }
};

const getReviewsWithComment = async (req, res) => {
    try {
        const reviews = await Review.find({
            comment: { $exists: true, $ne: '' }
        })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las reseñas con comentario.' });
    }
};

module.exports = {createReview, getAllReviews, getReviewsWithComment};