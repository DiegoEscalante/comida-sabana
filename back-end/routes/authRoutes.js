const express = require('express')
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'}
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:'30d'}
    )
}



// GET


// POST
router.post('/signup', async (req, res) => {
    const {id, email, password, name, lastName, role, restaurantId} = req.body;
    
    try{

        const existingUser = await User.findOne({$or:[{email}, {id}]}); //Search for user with same email
        if (existingUser) {
            return res.status(400).json({error: "The email or id is already in use."});
        }
        if (!email.endsWith("@unisabana.edu.co")){
            return res.status(400).json({error: "Only @unisabana.edu.co emails are allowed."});
        }

        const newUser = new User({id, email, password, name, lastName, role, restaurantId}); 
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
        }).status(201).json({message: 'Signup Successful', user:{id, email, name, lastName, role}});
    } catch(error){
        res.status(500).json({ error: "Error creating user."});

    }
})


// PUT

// DELETE

module.exports = router;