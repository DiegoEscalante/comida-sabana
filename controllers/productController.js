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
        console.error(error); // Log the error for debugging
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation error', details: error.message });
        } // If the error is a validation error, return a 400 status code with the error message.
        res.status(500).json({ error: "Error creating product." });
    }
};

const updateProduct = async (req, res) => {
    const  productId  = req.params.id; //Gets productId from the URL parameters
    const { name, description, price, imageUrl, quantity, categories, available } = req.body; 
    const existingProduct = await Product.findById(productId); // Fetch the existing product to retain restaurantId
    if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
    }
    const cleanedImageUrl = (imageUrl && imageUrl !== existingProduct.imageUrl) ? parseS3Link(imageUrl) : existingProduct.imageUrl; // Parse only if the image URL changed (REVIEW THIS LOGIC)
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
    const productsPerRestaurant = 5; // Number of products to return per restaurant
    try {
        const products = await Product.aggregate([
            { $match: { available: true } }, // Only available products
            {
                $group: {
                    _id: "$restaurantId",
                    products: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 1,
                    products: { $slice: ["$products", productsPerRestaurant] }
                }
            }
        ]);
        res.status(products.length ? 200 : 404).json(products.length ? products : { message: 'Products not found' });
    } catch (error) {
        res.status(500).json({ error: "Error fetching products." });
    }
};

const deleteProduct = async (req, res) => {
    const  productId  = req.params.id; //Gets productId from the URL parameters
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

const getAvailableProductsByRestaurantId = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    try {
        const products = await Product.find({ restaurantId, available: true });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No available products found' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching available products." });
    }
};

const getAllProductsByRestaurantId = async (req, res) => {
    const restaurantId = req.params.restaurantId;
    try {
        const products = await Product.find({ restaurantId });
        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'Products not found' });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products." });
    }
};

const getProductById = async (req, res) => {
    const  productId  = req.params.id; //Gets productId from the URL parameters
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product); // Return the product found by its ID
    } catch (error) {
        res.status(500).json({ error: "Error fetching product." });
    }
}



module.exports = {getAvailableProductsByRestaurantId, getAllProductsByRestaurantId, getProducts, updateProduct, deleteProduct, getProductById, createProduct};