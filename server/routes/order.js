const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const { verify, verifyUser, verifyAdmin } = require("../middlewares/auth");

// Route for user checkout
router.post('/checkout', verify, verifyUser, orderController.createOrder);

// Route for user to get their orders
router.get('/my-orders', verify, verifyUser, orderController.getOrders);

// Route for admin to get all orders
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);

// Cancel an order (Only if "Pending" or "Processing")
router.patch("/:orderId/cancel", verify, orderController.cancelOrder);

// Route for admin to update the order status
router.patch('/update-status', verify, verifyAdmin, orderController.updateOrderStatus);

module.exports = router;
