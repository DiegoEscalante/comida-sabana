const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    name: { type: String },
    products: [
        {
            productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    restaurantId: { type: mongoose.Types.ObjectId, ref: 'Restaurant', required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    creationDate: { type: Date, default: Date.now },
    reservationDate: { type: Date, required: true },
    preparationStartDate: { type: Date },
    finishedDate: { type: Date },
    deliveredDate: { type: Date }
});

module.exports = mongoose.model('Order', orderSchema);