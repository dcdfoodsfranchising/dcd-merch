const Product = require("../Models/Product");
const auth = require('../middlewares/auth');
const { errorHandler } = auth;
const cloudinary = require('../config/cloudinary');

// Create a new product
module.exports.createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity || 0,
            image: req.body.image || "",
            isFeatured: req.body.isFeatured || false,
            isActive: req.body.isActive !== undefined ? req.body.isActive : true
        });

        await product.save();
        res.status(201).json({
            message: "Product added successfully",
            product
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
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product info
module.exports.updateProductInfo = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct: product
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
            archivedProduct: product
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
            activatedProduct: product
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Search Products by Name
module.exports.searchProductsByName = async (req, res) => {
    try {
        const { productName } = req.body;
        const products = await Product.find({ name: { $regex: new RegExp(productName, 'i') } });
        if (!products.length) {
            return res.status(404).json({ message: 'No products found with the specified name' });
        }
        res.status(200).json({ message: 'Products found successfully', products });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Search Products by Price
module.exports.searchProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;
        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
        if (!products.length) {
            return res.status(404).json({ message: 'No products found within the specified price range' });
        }
        res.status(200).json({ message: 'Products found successfully', products });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Toggle Featured Product
module.exports.toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ error: "Product not found" });

        product.isFeatured = !product.isFeatured;
        await product.save();

        res.status(200).json({ message: "Product featured status updated", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Upload Product Image
module.exports.uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image provided" });
        }
        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: req.file.path
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading image", error });
    }
};

// Delete Product Image
module.exports.deleteProductImage = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (!product.image) {
            return res.status(400).json({ error: "No image to delete" });
        }

        // Extract public_id from the image URL
        const imageUrl = product.image;
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract filename without extension

        // Delete image from Cloudinary
        const result = await cloudinary.uploader.destroy(`uploads/${publicId}`);

        if (result.result !== "ok") {
            return res.status(500).json({ error: "Error deleting image from Cloudinary" });
        }

        // Remove image reference from product
        product.image = "";
        await product.save();

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};