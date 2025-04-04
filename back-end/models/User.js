const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id: {type: Number, unique: true, validate: {validator: Number.isInteger}, required: true},
    email: {type: String, unique: true},
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    role: {type: Number, validate: {validator: Number.isInteger}, required: true},
    restaurantID: {type: Number, required: true}
})

module.exports = mongoose.model('User', userSchema);