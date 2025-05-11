const Product = require('../models/Product');

const updateProductStock = async (products) => {
    for (const { productId, quantity } of products) {
        await Product.findByIdAndUpdate(productId, {
            $inc: { quantity: -quantity },
        });
    }
};

module.exports = updateProductStock;