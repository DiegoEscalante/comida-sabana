const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    averageScore: {type: Number, default: 0, required: true},
    numberOfReviews: {type: Number, default: 0, required: true}, 
    averageDeliveryTime: {type: Number, default: 0, required: true}, 
    numberOfDeliveries: {type: Number, default: 0, required: true}, 
});

restaurantSchema.methods.updateAverageScore = async function(newScore) {
    // Cálculo del nuevo promedio
    this.averageScore = ((this.averageScore * this.numberOfReviews) + newScore) / (this.numberOfReviews + 1);
    // Incrementar el número de reseñas
    this.numberOfReviews += 1;
    await this.save();
};

module.exports = mongoose.model('Restaurant', restaurantSchema);