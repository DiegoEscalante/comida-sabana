const express = require('express')
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authenticate = require('../middlewares/authenticate');

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
router.get('/me', authenticate, async(req, res) => { //Only users authenticated can access
    try{
        const user = await User.findOne({ id: req.user.id }).select('-password'); // exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found.'});
        }
        res.status(200).json(user);
    } catch(error){
        console.error(error);
        res.status(500).json({error: 'Failed to fetch user data.'})
    }
});

// POST
router.post('/login', async(req, res) => {
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
})


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
        }).status(201).json({message: 'Signup successful', user:{id, email, name, lastName, role, restaurantId}});
    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Error creating user."});

    }
})


// PUT

// DELETE

module.exports = router;