const mongoose = require('mongoose');
require('./Restaurant');

const productSchema = new mongoose.Schema({
    restaurantId: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant', 
        required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, validate: {validator: Number.isInteger},required: true},
    categories: {type: [String], required: true},
    available:{type: Boolean, required: true}
});

module.exports = mongoose.model('Product', productSchema);
