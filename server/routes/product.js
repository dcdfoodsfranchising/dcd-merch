const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { verify, verifyAdmin } = require("../middlewares/auth");
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary setup

// 🔹 Setup Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => file.originalname.split('.')[0] + '-' + Date.now(),
  },
});

// 🔹 Initialize Multer AFTER defining storage
const upload = multer({ storage });

// 📌 Create a new product (Handles images)
router.post('/', verify, verifyAdmin, upload.array('images', 5), productController.createProduct);

// 📌 Get all products
router.get('/all', verify, verifyAdmin, productController.getAllProducts);

// 📌 Get all active products
router.get('/active', productController.activeProducts);

// 📌 Get a single product by ID
router.get('/:productId', productController.singleProduct);

// 📌 Update product information
router.patch('/:productId/update', verify, verifyAdmin, productController.updateProductInfo);

// 📌 Archive a product
router.patch('/:productId/archive', verify, verifyAdmin, productController.archiveProduct);

// 📌 Activate a product
router.patch('/:productId/activate', verify, verifyAdmin, productController.activateProduct);

// DELETE route to remove a product (only for admins)
router.delete("/:productId", verify, verifyAdmin, productController.deleteProduct);

// 📌 Search products by name
router.post('/search-by-name', productController.searchProductsByName);

// 📌 Search products by price
router.post('/search-by-price', productController.searchProductsByPrice);

// 📌 Add Stock
router.post("/:productId/add-stock", verify, verifyAdmin, productController.addStock);

// 📌 Add or Remove Product as Featured
router.patch('/:productId/feature', verify, verifyAdmin, productController.toggleFeaturedProduct);

// 📌 Upload or Replace Product Images (Fixed Field Name)
router.post(
    "/:productId/upload-images", verify, verifyAdmin,
    upload.array("images", 5), // Ensure "images" matches the frontend input field name
    productController.uploadProductImages
);

router.patch('/:productId/update-quantity', verify, productController.updateProductQuantity);

// 📌 Delete a Product Image
router.delete('/:productId/delete-image', verify, verifyAdmin, productController.deleteProductImage);

module.exports = router;
