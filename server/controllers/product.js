const Product = require("../models/Product");
const auth = require('../auth')
const bcrypt = require('bcryptjs');
const { errorHandler } = auth;


// Create a new product
module.exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({
            message: "Product added successfully",
            product: {
                name: product.name,
                description: product.description,
                price: product.price,
                isActive: product.isActive,
                id: product._id,
                createdOn: product.createdOn,
                __v: product.__v
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Retrieve all products
module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all active products
module.exports.activeProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Single Product
module.exports.singleProduct = async (req, res) => {
    try {
        // Fetch the product by ID from the request parameters
        const product = await Product.findById(req.params.productId);

        // If the product is not found, return a 404 error
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Return the product details in the expected format
        res.status(200).json({
            product: {
                id: product._id.toString(), 
                name: product.name,
                description: product.description,
                price: product.price,
                isActive: product.isActive,
                createdOn: product.createdOn,
                __v: product.__v
            }
        });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: error.message });
    }
};

// Update product info
module.exports.updateProductInfo = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
        	message: "Product updated successfully",
            updatedProduct: {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                isActive: product.isActive,
                createdOn: product.createdOn,
                __v: product.__v
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Archive a product (set isActive to false)
module.exports.archiveProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            { isActive: false },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
            message: 'Product archived successfully',
            archivedProduct: {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                isActive: product.isActive,
                createdOn: product.createdOn,
                __v: product.__v
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Activate a product (set isActive to true)
module.exports.activateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            { isActive: true },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
            message: "Product activated successfully",
            activateProduct: {
                id: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                isActive: product.isActive,
                createdOn: product.createdOn,
                __v: product.__v
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.searchProductsByName = async (req, res) => {
    try {
        const { productName } = req.body; // Get the product name from the request body

        // Search for products with a matching name (case-insensitive)
        const products = await Product.find({ name: { $regex: new RegExp(productName, 'i') } });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found with the specified name' });
        }

        // Respond with the matching products
        res.status(200).json({ message: 'Products found successfully', products });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

module.exports.searchProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body; // Get minPrice and maxPrice from the request body

        // Search for products within the specified price range
        const products = await Product.find({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found within the specified price range' });
        }

        // Respond with the matching products
        res.status(200).json({ message: 'Products found successfully', products });
        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};


