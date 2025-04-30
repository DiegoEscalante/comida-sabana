const Product = require('../models/Product'); 

const authorizePOSByProduct = async (req, res, next) => {
  try {
    const user = req.user;
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (product.restaurantId.toString() !== user.restaurantId) {
      return res.status(403).json({ error: "User doesn't belong to the restaurant the product is from." });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error checking restaurant.' });
  }
};

module.exports = authorizePOSByProduct;