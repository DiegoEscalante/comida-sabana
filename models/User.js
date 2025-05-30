const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('./Restaurant');

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    role: {type: String, required: true},
    restaurantId: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'Restaurant',
        required: function(){
            return this.role === 'pos'; // Only required for 'pos' users
        },
    default: null}
})

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // In case the password hasn't changed, it doesn't hash it again.
    try{
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);
        this.password = hashedPassword;
        next();
    } catch (error){
        next(error); // Throws error up the chain in case the password couldn't be hashed
    }
})

module.exports = mongoose.model('User', userSchema);