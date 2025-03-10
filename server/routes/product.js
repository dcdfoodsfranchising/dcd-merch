const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

// Create a new product
router.post('/',verify, verifyAdmin, productController.createProduct);

// Get all products
router.get('/all', verify, verifyAdmin, productController.getAllProducts);

// Get all active products
router.get('/active', productController.activeProducts);

// Get a single product by ID
router.get('/:productId', productController.singleProduct);

// Update product information
router.patch('/:productId/update', verify, verifyAdmin, productController.updateProductInfo);

// Archive a product
router.patch('/:productId/archive', verify, verifyAdmin, productController.archiveProduct);

// Activate a product
router.patch('/:productId/activate', verify, verifyAdmin, productController.activateProduct);

// Search products by name
router.post('/search-by-name', productController.searchProductsByName);

// Search products by price
router.post('/search-by-price', productController.searchProductsByPrice)

module.exports = router;