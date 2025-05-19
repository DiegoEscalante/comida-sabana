const Product = require('../models/Product');

const restoreProductStock = async (products) => {
    for (const item of products) {
        const product = await Product.findById(item.productId);
        if (product) {
            product.quantity += item.quantity;
            await product.save();
        }
    }
};

module.exports = restoreProductStock;