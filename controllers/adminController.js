const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

const assignPosToUser = async (req, res) => {
    const { id } = req.params;
    const { restaurantId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ error: 'Invalid restaurantId' });
    }

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        user.role = 'pos';
        user.restaurantId = restaurantId;
        await user.save();

        res.status(200).json({ message: 'User assigned as POS successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error assigning POS to user' });
    }
};

module.exports = { assignPosToUser };