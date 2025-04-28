const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try{
        await mongoose.connect(process.env.MONGODB_URI); //Connects to the URI defined in .env
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) { 
        console.error('MongoDB connection error', error);
        throw error;
    } 
};

module.exports = connectDB;