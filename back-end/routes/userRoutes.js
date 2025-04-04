const express = require('express')
const router = express.Router();
const User = require('../models/User');

// GET


// POST
router.post('/', async (req, res) => {
    const {id, email, password, name, lastName, role, restaurantID} = req.body;
    
    try{

        const existingUser = await User.findOne({email}); //Search for user with same email
        if (existingUser) {
            return res.status(400).json({error: "The email is already in use."});
        }
        if (!email.endsWith("@unisabana.edu.co")){
            return res.status(400).json({error: "Only @unisabana.edu.co emails are allowed."});
        }

        const newUser = new User({ id, email, password, name, lastName, role, restaurantID}); 
        await newUser.save(); //At this point the .pre('save') middleware is triggered
        res.status(201).json(newUser);

    } catch(error){
        res.status(500).json({ error: "Error creating user."});

    }
})

// PUT

// DELETE