const Product = require("../Models/Product");
const auth = require('../middlewares/auth');
const { errorHandler } = auth;
const cloudinary = require('../config/cloudinary');

// Create a new product
module.exports.createProduct = async (req, res) => {
    try {
        const { name, description, isFeatured, isActive } = req.body;
        let { variants } = req.body;
        let imageUrls = [];

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        // Parse variants if it's a string
        if (typeof variants === 'string') {
            variants = JSON.parse(variants);
        }

        // Validate variants
        if (!Array.isArray(variants) || variants.some(v => !v.name || !v.price || !v.quantity)) {
            return res.status(400).json({ message: "Each variant must have a name, price, and quantity" });
        }

        // Upload images to Cloudinary if provided
        if (req.files && req.files.length > 0) {
            imageUrls = await Promise.all(
                req.files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path);
                    return result.secure_url;
                })
            );
        }

        const product = new Product({
            name,
            description,
            images: imageUrls,
            isFeatured: isFeatured || false,
            isActive: isActive !== undefined ? isActive : true,
            variants // Save variants with their prices
        });

        await product.save();
        res.status(201).json({ message: "Product added successfully", product });

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

// DELETE a product by ID
module.exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await Product.findByIdAndDelete(productId);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
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
        res.status(500).json({ error: error.message }); a
    }
} ;
  
// Update product info
module.exports.updateProductInfo = async (req, res) => {
    try {
        // Extract the product ID from the request parameters
        const { productId } = req.params;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update only the fields provided in the request body
        Object.keys(req.body).forEach((key) => {
            product[key] = req.body[key];
        });

        // Save the updated product
        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            updatedProduct: product
        });
    } catch (error) {
        console.error("Error updating product:", error);
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

// Add Stock to a Specific Variant
module.exports.addStock = async (req, res) => {
    try {
        const { variantName, quantity } = req.body;
        const product = await Product.findById(req.params.productId);

        if (!product) return res.status(404).json({ error: "Product not found" });

        const variant = product.variants.find(v => v.name === variantName);
        if (!variant) {
            return res.status(404).json({ error: "Variant not found" });
        }

        variant.quantity += parseInt(quantity, 10);
        await product.save();

        res.status(200).json({ message: "Stock updated", product });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
module.exports.uploadProductImages = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }

        // Upload all images to Cloudinary and get their URLs
        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path);
                return result.secure_url;
            })
        );

        // Append new images to the existing images array
        product.images = [...product.images, ...uploadedImages];
        await product.save();

        res.json({
            message: "Images uploaded successfully",
            images: product.images, // Return all images
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Image upload failed",
            details: error.message,
        });
    }
};



// Delete Product Image
module.exports.deleteProductImage = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { imageUrl } = req.body; // The specific image to delete

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (!product.images || product.images.length === 0) {
            return res.status(400).json({ error: "No images to delete" });
        }

        let publicId;
        if (imageUrl) {
            // Extract public_id for single image deletion
            const parts = imageUrl.split('/');
            const publicIdWithExtension = parts[parts.length - 1]; // Last part of URL (filename)
            publicId = publicIdWithExtension.split('.')[0]; // Remove extension
        }

        if (imageUrl) {
            // Delete single image from Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result !== "ok") {
                return res.status(500).json({ error: "Error deleting image from Cloudinary" });
            }

            // Remove the image from the `images` array in MongoDB
            await Product.findByIdAndUpdate(productId, { $pull: { images: imageUrl } });

            return res.json({ message: "Image deleted successfully" });
        } else {
            // Delete all images from Cloudinary
            const deletionResults = await Promise.all(
                product.images.map(async (img) => {
                    const imgParts = img.split('/');
                    const imgPublicId = imgParts[imgParts.length - 1].split('.')[0];
                    return cloudinary.uploader.destroy(imgPublicId);
                })
            );

            // Check if any deletions failed
            if (deletionResults.some((res) => res.result !== "ok")) {
                return res.status(500).json({ error: "Error deleting some images from Cloudinary" });
            }

            // Remove all images from database
            await Product.findByIdAndUpdate(productId, { $unset: { images: 1 } });

            return res.json({ message: "All images deleted successfully" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

