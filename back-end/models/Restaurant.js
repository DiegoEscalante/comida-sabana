const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    imageUrl: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true}, 
    averageScore: {type: Number, required: true},
    numberOfReviews: {type: Number, required: true}, 
    estimatedTime: {type: Number, required: true},
    numberOfDeliveries: {type: Number, required: true}
});

module.exports = mongoose.model('Restaurant', restaurantSchema);