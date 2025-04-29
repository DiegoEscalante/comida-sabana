const { Types } = require('mongoose');
const Restaurant = require('../models/Restaurant');

const createRestaurant = async (req, res) => {
  try {
    const { name } = req.body;

    const newRestaurant = new Restaurant({ name });
    await newRestaurant.save();

    res.status(201).json({
      message: 'Restaurante creado exitosamente.',
      restaurant: newRestaurant
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el restaurante.' });
  }
};

const getRestaurantInfo = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        if (!Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'ID de restaurante inválido' });
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(200).json({ message: 'Restaurante no encontrado', restaurant: null });
        }

        res.status(200).json(restaurant);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la información del restaurante' });
    }
};

module.exports = {createRestaurant, getRestaurantInfo}