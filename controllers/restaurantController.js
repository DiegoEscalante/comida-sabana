const Restaurant = require('../models/Restaurant');

const getRestaurants =  async (req, res) => 
    { try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
        } catch (err) {
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
}
module.exports = { getRestaurants };