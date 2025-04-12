const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {type: Number, unique: true, validate: {validator: Number.isInteger}, required: true},
    restaurantId: {type: Number, validate:{validator: Number.isInteger}, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, validate: {validator: Number.isInteger},required: true},
    categories: {type: [String], required: true},
    isAvailableForSale:{type: Boolean, required: true}
});

