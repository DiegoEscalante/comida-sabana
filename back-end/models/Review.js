const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    restaurantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: true 
    },
    orderId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    score: { 
        type: Number, 
        required: true,
        min: 1,
        max: 5 
    },
    comment: { 
        type: String, 
        required: true 
    }
}, { timestamps: true }); 

reviewSchema.post('save', async function(doc) {
    const restaurant = await Restaurant.findById(doc.restaurantId);
    if (restaurant) {
        await restaurant.updateAverageScore(doc.score);
    }
});

module.exports = mongoose.model('Review', reviewSchema);