const Restaurant = require('../models/Restaurant');

const getRestaurants =  async (req, res) => 
    { try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
        } catch (err) {
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
}

const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch restaurant' });
    }
};

module.exports = { getRestaurants, getRestaurantById };