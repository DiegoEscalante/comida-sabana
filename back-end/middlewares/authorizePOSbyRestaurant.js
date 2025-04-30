const authorizePOSByRestaurant = async (req, res, next) => {
    try {
      const user = req.user;
      const restaurantId = req.params.restaurantId;
  
      if (!user.restaurantId || user.restaurantId !== restaurantId) {
        return res.status(403).json({ error: "User doesn't belong to this restaurant." });
      }
  
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Authorization error.' });
    }
  };
  
  module.exports = authorizePOSByRestaurant;