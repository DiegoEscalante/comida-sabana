const Product = require('../models/Product');
const parseS3Link = require('../lib/parseS3Link');

const createProduct = async (req, res) => {
    const { name, description, price, imageUrl, quantity, categories, available } = req.body; 
    const restaurantId = req.user.restaurantId; //Gets restaurantId from the user object in the request
    const cleanedImageUrl = parseS3Link(imageUrl); //Parse the S3 link to get the correct URL
    try {
        const newProduct = new Product({ name, description, price, restaurantId, imageUrl:cleanedImageUrl, quantity, categories, available});
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error creating product." });
    }
};

const updateProduct = async (req, res) => {
    const { productId } = req.params; //Gets productId from the URL parameters
    const { name, description, price, imageUrl, quantity, categories, available } = req.body; 
    const existingProduct = await Product.findById(productId); // Fetch the existing product to retain restaurantId
    if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const cleanedImageUrl = (imageUrl !== existingProduct.image) ? parseS3Link(imageUrl) : existingProduct.image; // Parse only if the image URL changed
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, { name, description, price, imageUrl:cleanedImageUrl, quantity, categories, available}, { new: true }); // Return the updated product
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Error updating product." });
    }
}

const getProducts = async (req, res) => {
    const productsPerRestaurant = 5; // Define the number of products to return per restaurant
    try { 
        const products = await Product.aggregate([{$group: {_id: "$restaurantId", products: { $push: "$$ROOT" }}}, // Group products by restaurantId, 
            {
                $project: {
                    _id: 1,
                    products: { $slice: ["$products", productsPerRestaurant] }
                } // Limit the number of products per restaurant returned.
            }
        ]);

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'Products not found' });
        } // If no products are found, return a 404 error.

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products." });
    }
};

const deleteProduct = async (req, res) => {
    const { productId } = req.params; //Gets productId from the URL parameters
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId); // Deletes the product by its ID
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        } // If the product is not found, return a 404 error.
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: "Error deleting product." });
    }
};

const getProductsByRestaurantId = async (req, res) => {
    const { restaurantId } = req.params; //Gets restaurantId from the URL parameters
    try {
        const products = await Product.find({ restaurantId });
        if (!products) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products." });
    }
};

const getProductById = async (req, res) => {
    const { productId } = req.params; //Gets productId from the URL parameters
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching product." });
    }
}



module.exports = {getProductsByRestaurantId, getProducts, updateProduct, deleteProduct, getProductById, createProduct};