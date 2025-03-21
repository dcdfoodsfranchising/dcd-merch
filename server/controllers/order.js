const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
const auth = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const { errorHandler } = auth;

module.exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the cart for the user and populate the cartItems if needed
        const cart = await Cart.findOne({ userId }).populate('cartItems.productId');

        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return res.status(404).json({ message: 'No items in the cart to checkout' });
        }

        // Ensure cartItems is an array and has items
        const productsOrdered = cart.cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal,
            _id: item._id
        }));

        if (productsOrdered.length === 0) {
            return res.status(400).json({ error: 'No items to checkout' });
        }

        // Check that each product in the cart has a valid price and quantity
        for (let item of productsOrdered) {
            if (!item.productId || !item.productId.price || item.quantity <= 0) {
                return res.status(400).json({ error: 'Invalid product data in cart' });
            }
        }

        // Create a new order with initial status 'Pending'
        const order = new Order({
            userId,
            productsOrdered,
            totalPrice: cart.totalPrice,
            status: 'Pending'  // Default status
        });

        // Save the order
        await order.save();

        // Clear the cart
        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            message: 'Order placed successfully',
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports.getOrders = async (req, res) => {
    try {
        // Fetch orders for the logged-in user and populate product details
        const orders = await Order.find({ userId: req.user.id }).populate({
            path: 'productsOrdered.productId',
            select: 'name description price',
            model: 'Product' // Ensure you specify the model if needed
        });

        // If no orders found, return an empty array
        if (!orders || orders.length === 0) {
            return res.status(200).json({ message: 'No orders found', orders: [] });
        }

        // Return the orders with product details and status
        res.status(200).json({
            orders: orders.map(order => ({
                _id: order._id,
                orderedOn: order.orderedOn,
                status: order.status,  // Add status to response
                totalPrice: order.totalPrice,
                productsOrdered: order.productsOrdered.map(item => ({
                    productId: item.productId._id,
                    name: item.productId.name,
                    description: item.productId.description,
                    price: item.productId.price,
                    quantity: item.quantity,
                    subtotal: item.subtotal
                }))
            }))
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};

module.exports.getAllOrders = async (req, res) => {
    try {
        // Fetch all orders for the admin
        const orders = await Order.find().populate({
            path: 'productsOrdered.productId',
            select: 'name description price'
        });

        // If no orders found, return an empty array
        if (!orders || orders.length === 0) {
            return res.status(200).json({ message: 'No orders found', orders: [] });
        }

        // Format the order details
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            userId: order.userId,
            productsOrdered: order.productsOrdered.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                description: item.productId.description,
                price: item.productId.price,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            totalPrice: order.totalPrice,
            status: order.status,  // Add status to response
            orderedOn: order.orderedOn,
        }));

        // Send the formatted orders in the response
        res.status(200).json({ orders: formattedOrders });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Update the status of an order (for admin)
module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Valid statuses for the order
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find the order and update its status
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the status and add status history (if required)
        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
