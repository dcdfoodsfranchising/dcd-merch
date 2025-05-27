const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const { verify, verifyUser } = require("../middlewares/auth");

// Get Cart Items
router.get('/get-cart', verify, verifyUser, cartController.getCartItems);

// Add to Cart
router.post('/add-to-cart', verify, verifyUser, cartController.addToCart);

// Update cart quantity
router.patch('/update-cart-quantity', verify, verifyUser, cartController.updateCartQuantity);

// Remove product by id from cart
router.patch('/:productId/remove-from-cart', verify, verifyUser, cartController.removeCartItem);

// Clear all products in cart
router.put('/clear-cart', verify, verifyUser, cartController.clearCart);

// Add this route
router.post('/buy-again', verify, verifyUser, cartController.buyAgainToCart);




module.exports = router;