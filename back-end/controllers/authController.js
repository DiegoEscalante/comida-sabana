const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../lib/token');

const getMe = async (req, res) => {
    try{
        const user = await User.findOne({ id: req.user.id }).select('-password'); // exclude password
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
            id: user.id, 
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
    const {id, email, password, name, lastName} = req.body;
    
    try{

        const existingUser = await User.findOne({$or:[{email}, {id}]}); //Search for user with same email
        if (existingUser) {
            return res.status(400).json({error: "The email or id is already in use."});
        }
        if (!email.endsWith("@unisabana.edu.co")){
            return res.status(400).json({error: "Only @unisabana.edu.co emails are allowed."});
        }
        // Every new user starts as client with no assigned restaurant. It can be changed in the database if user is pos.
        const newUser = new User({id, email, password, name, lastName, role: 'client', restaurantId: 0}); 
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
        }).status(201).json({message: 'Signup successful', user:{id, email, name, lastName, role, restaurantId}});
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
            const user = await User.findOne({id: decoded.id});
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
    }
}

const test = async (req, res) => {
    try {
        res.status(200).json('good to go');
        } catch(error) {
            console.error(error);
    }
}

module.exports = {getMe, login, signup, refreshToken, test};