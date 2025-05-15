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
        if (
            !Array.isArray(variants) ||
            variants.some(
              (v) =>
                (!v.size && !v.color) || // must have at least one of size or color
                typeof v.price !== 'number' ||
                typeof v.quantity !== 'number'
            )
          ) {
            return res.status(400).json({
              message: "Each variant must have at least size or color, and valid price and quantity."
            });
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


module.exports.updateProductInfo = async (req, res) => {
    try {
      const { productId } = req.params;
  
      // Find the product
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      let { variants } = req.body;
  
      // Log the request body to debug
      console.log('Received body:', req.body);
  
      // Parse variants if sent as string (e.g. from Postman/form-data)
      if (typeof variants === 'string') {
        variants = JSON.parse(variants);
      }
  
      // Handle variant validation (if being updated)
      if (Array.isArray(variants)) {
        const isInvalid = variants.some(
          (v) =>
            (!v.size && !v.color) ||
            typeof v.price !== 'number' ||
            typeof v.quantity !== 'number'
        );
  
        if (isInvalid) {
          return res.status(400).json({
            error: 'Each variant must have at least size or color, and valid price and quantity.'
          });
        }
  
        product.variants = variants; // replace existing variants
        product.markModified('variants');
      }
  
      // Handle image uploads if new images are provided
      if (req.files && req.files.length > 0) {
        const imageUrls = await Promise.all(
          req.files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
          })
        );
        product.images = imageUrls;
        product.markModified('images');
      }
  
      // Update other fields dynamically (excluding variants and images)
      const excludedKeys = ['variants', 'images'];
      Object.keys(req.body).forEach((key) => {
        if (!excludedKeys.includes(key)) {
          product[key] = req.body[key];
        }
      });
  
      // Save the updated product and log the result
      const updatedProduct = await product.save();
      console.log('Product saved:', updatedProduct);
  
      res.status(200).json({
        message: 'Product updated successfully',
        updatedProduct
      });
    } catch (error) {
      console.error('Error updating product:', error);
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
      const { size, color, quantity } = req.body;
      const product = await Product.findById(req.params.productId);
  
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Find the matching variant using size and/or color
      const variant = product.variants.find(v =>
        (size ? v.size === size : true) &&
        (color ? v.color === color : true)
      );
  
      if (!variant) {
        return res.status(404).json({ error: "Variant not found" });
      }
  
      variant.quantity += parseInt(quantity, 10);
  
      // Mark variants modified for Mongoose to recognize changes
      product.markModified("variants");
      await product.save();
  
      res.status(200).json({
        message: "Stock updated successfully",
        updatedVariant: variant,
        product
      });
  
    } catch (error) {
      console.error("Error in addStock:", error);
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


// Update (add or subtract) product or variant quantity
module.exports.updateProductQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, color, quantityChange } = req.body; // quantityChange: positive or negative integer

    if (typeof quantityChange !== "number" || quantityChange === 0) {
      return res.status(400).json({ error: "quantityChange must be a non-zero number" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // If product has variants, update the correct variant
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      const variant = product.variants.find(
        (v) =>
          (size ? v.size === size : true) &&
          (color ? v.color === color : true)
      );
      if (!variant) {
        return res.status(404).json({ error: "Variant not found" });
      }
      const newQty = variant.quantity + quantityChange;
      if (newQty < 1) {
        return res.status(400).json({ error: "Quantity cannot be less than 1" });
      }
      variant.quantity = newQty;
      product.markModified("variants");
    } else {
      // No variants, update product quantity directly
      const newQty = product.quantity + quantityChange;
      if (newQty < 1) {
        return res.status(400).json({ error: "Quantity cannot be less than 1" });
      }
      product.quantity = newQty;
    }

    await product.save();
    res.status(200).json({ message: "Product quantity updated", product });
  } catch (error) {
    console.error("Error updating product quantity:", error);
    res.status(500).json({ error: error.message });
  }
};
