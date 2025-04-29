const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Review = require('../models/Review');
const Order = require('../models/Order');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../lib/token');

const getMe = async (req, res) => {
    try{
        const user = await User.findOne({_id: req.user.id }).select('-password'); // exclude password
        if (!user) return res.status(404).json({ error: 'User not found.'});
        res.status(200).json({message: 'User authenticated.', user});
    } catch(error){
        console.error(error);
        res.status(500).json({error: 'Failed to fetch user data.'})
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email}); //Checks if email exists
        if (!user) return res.status(400).json({error: "Invalid credentials."});
        const isMatch = await bcrypt.compare(password, user.password); //Checks if password matches the specified user password
        if (!isMatch) return res.status(400).json({error: "Invalid credentials."});
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure:true,
            sameSite: 'Strict',
            maxAge: 1000*60*60, //1h
        }).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 1000*60*60*24*30, //30d
        }).status(200).json({message: 'Login successful.', user:{
            email: user.email, 
            name: user.name, 
            lastName: user.lastName, 
            role: user.role, 
            restaurantId: user.restaurantId}});
    } catch(error){
        console.error(error);
    }
};

const signup = async (req, res) => {
    const {email, password, name, lastName} = req.body;
    
    try{

        const existingUser = await User.findOne({email}); //Search for user with same email
        if (existingUser) {
            return res.status(400).json({error: "The email is already in use."});
        }
        // Every new user starts as client with no assigned restaurant. It can be changed in the database if user is pos.
        const newUser = new User({email, password, name, lastName, role: 'client'}); 
        await newUser.save(); //At this point the .pre('save') middleware is triggered
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);        
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure:true,
            sameSite: 'Strict',
            maxAge: 1000*60*60, //1h
        }).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 1000*60*60*24*30, //30d
        }).status(201).json({message: 'Signup successful', user:{email, name, lastName, role: 'client', restaurantId: 0}});
    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Error creating user."});

    }
};

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({error: 'No refresh token provided.'});
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (error, decoded) => {
            if (error) return res.status(403).json({ error: 'Invdalid refresh token.'});
            const user = await User.findOne({_id: decoded.id});
            if (!user) return res.status(404).json({ error: 'User not found.'});     
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure:true,
                sameSite: 'Strict',
                maxAge: 1000*60*60, //1h
                }).cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 1000*60*60*24*30, //30d
            }).status(200).json({message: 'Token refreshed'});
        })} catch(error) {
            console.error(error);
            res.status(500).json({ error: 'Error refreshing tokens.'});
    }
}

const logout = async (req, res) => {
    try{
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure:true,
            sameSite: 'Strict',
            })
            .clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            })
            .status(204).json({message: 'Logout successful.'});
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error loging out user.'});
    }
}

const test = async (req, res) => {
    try {
        res.status(200).json('good to go');
        } catch(error) {
            console.error(error);
    }
}

const getAllReviews = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        
        // Validar si el ID es válido
        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'ID de restaurante inválido' });
        }
        
        // Buscar las reseñas asociadas al restaurante
        const reviews = await Review.find({ restaurantId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        // Si no hay reseñas, enviar mensaje especial pero con status 200
        if (reviews.length === 0) {
            return res.status(200).json({ message: 'No hay reseñas para este restaurante.', reviews: [] });
        }

        // Si hay reseñas, enviarlas normalmente
        res.status(200).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las reseñas' });
    }
};

const getRestaurantInfo = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Validar si el ID es válido
        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'ID de restaurante inválido' });
        }

        // Buscar el restaurante
        const restaurant = await Restaurant.findById(restaurantId);

        // Si no se encuentra el restaurante
        if (!restaurant) {
            return res.status(200).json({ message: 'Restaurante no encontrado', restaurant: null });
        }

        // Si se encuentra el restaurante
        res.status(200).json(restaurant);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la información del restaurante' });
    }
};

const createReview = async (req, res) => {
    try {
        const { orderId, score, comment } = req.body;
        const userId = req.userId; // Suponiendo que el ID del usuario viene autenticado en el middleware

        // Validar que el ID de la orden sea válido
        if (!Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'ID de orden inválido.' });
        }

        // Buscar la orden
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada.' });
        }

        // Verificar que el usuario dueño de la orden sea el mismo que intenta calificar
        if (order.userId.toString() !== userId) {
            return res.status(403).json({ message: 'No tienes permiso para calificar esta orden.' });
        }

        // Verificar que no haya ya una reseña para esta orden
        const existingReview = await Review.findOne({ orderId: orderId });
        if (existingReview) {
            return res.status(409).json({ message: 'Esta orden ya tiene una reseña.' });
        }

        // Validar que el restaurante exista (seguridad adicional)
        const restaurant = await Restaurant.findById(order.restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurante asociado a la orden no encontrado.' });
        }

        // Validar que score esté en el rango correcto
        if (typeof score !== 'number' || score < 1 || score > 5) {
            return res.status(400).json({ message: 'La calificación (score) debe ser un número entre 1 y 5.' });
        }

        // Crear nueva reseña (comentario es opcional)
        const newReview = new Review({
            userId,
            restaurantId: order.restaurantId,
            orderId: order._id,
            score,
            comment: comment ? comment.trim() : '' // Puede ser vacío
        });

        await newReview.save(); // Disparará automáticamente el post('save') que actualiza el promedio

        res.status(201).json({ message: 'Reseña creada exitosamente.', review: newReview });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reseña.' });
    }
};

const getReviewsWithComments = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Validar que el ID del restaurante sea válido
        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'ID de restaurante inválido.' });
        }

        // Buscar solo reseñas que tengan comentarios (comment != '')
        const reviews = await Review.find({
            restaurantId: restaurantId,
            comment: { $ne: '' } // $ne = "not equal", es decir, distinto de ''
        })
        .populate('userId', 'name') // Opcional: traer nombre del usuario
        .sort({ createdAt: -1 });

        // Si no hay reseñas con comentarios
        if (reviews.length === 0) {
            return res.status(200).json({ message: 'No hay reseñas con comentario para este restaurante.', reviews: [] });
        }

        res.status(200).json(reviews);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las reseñas con comentarios.' });
    }
};

module.exports = {getMe, login, signup, refreshToken, logout, test, getAllReviews, getRestaurantInfo, createReview, getReviewsWithComments};