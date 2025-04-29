const { Types } = require('mongoose');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

const getAllReviews = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        
        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'ID de restaurante inválido' });
        }
        
        const reviews = await Review.find({ restaurantId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        if (reviews.length === 0) {
            return res.status(200).json({ message: 'No hay reseñas para este restaurante.', reviews: [] });
        }

        res.status(200).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las reseñas' });
    }
};

const createReview = async (req, res) => {
    try {
        const { orderId, score, comment } = req.body;
        const userId = req.userId; 

        const newReview = new Review({
            userId,
            restaurantId: order.restaurantId,
            orderId: order._id,
            score,
            comment: comment ? comment.trim() : '' 
        });

        await newReview.save(); 

        res.status(201).json({ message: 'Reseña creada exitosamente.', review: newReview });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reseña.' });
    }
};

const getReviewsWithComments = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'ID de restaurante inválido.' });
        }

        const reviews = await Review.find({
            restaurantId: restaurantId,
            comment: { $ne: '' } // $ne = "not equal", es decir, distinto de ''
        })
        .populate('userId', 'name')
        .sort({ createdAt: -1 });

        if (reviews.length === 0) {
            return res.status(200).json({ message: 'No hay reseñas con comentario para este restaurante.', reviews: [] });
        }

        res.status(200).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las reseñas con comentarios.' });
    }
};

module.exports = {getAllReviews, createReview, getReviewsWithComments}