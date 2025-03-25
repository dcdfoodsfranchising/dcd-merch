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

        // Find the cart for the user and populate the cart items
        const cart = await Cart.findOne({ userId }).populate('cartItems.productId');

        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return res.status(404).json({ message: 'No items in the cart to checkout' });
        }

        let totalPrice = 0;
        const productsOrdered = [];

        // Check stock availability and deduct quantity
        for (let item of cart.cartItems) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.productId}` });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ 
                    error: `Not enough stock for ${product.name}. Available: ${product.quantity}` 
                });
            }

            // Deduct stock
            product.quantity -= item.quantity;
            await product.save(); // ✅ Update product stock in DB

            // Add to order list
            productsOrdered.push({
                productId: product._id,
                quantity: item.quantity,
                subtotal: item.subtotal
            });

            totalPrice += item.subtotal;
        }

        // Create a new order with status 'Pending'
        const order = new Order({
            userId,
            productsOrdered,
            totalPrice,
            status: 'Pending'
        });

        // Save the order
        await order.save();

        // Clear the user's cart
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
        console.log("Fetching all orders..."); // Debugging log

        // Fetch orders from the database with proper population
        const orders = await Order.find()
            .populate({
                path: 'productsOrdered.productId',
                select: 'name description price'
            })
            .populate({
                path: 'userId',
                select: 'firstName lastName email' // Fetch user details
            });

        console.log("Orders fetched:", orders); // Log fetched orders

        if (!orders || orders.length === 0) {
            return res.status(200).json({ message: 'No orders found', orders: [] });
        }

        // Format the order details
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            user: {
                userId: order.userId._id,
                name: `${order.userId.firstName} ${order.userId.lastName}`,
                email: order.userId.email
            },
            productsOrdered: order.productsOrdered.map(item => ({
                productId: item.productId?._id || "Unknown", // Avoid crashing if missing
                name: item.productId?.name || "Unknown Product",
                description: item.productId?.description || "No Description",
                price: item.productId?.price || 0,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            totalPrice: order.totalPrice,
            status: order.status,
            orderedOn: order.orderedOn,
            statusHistory: order.statusHistory // Include status history
        }));

        console.log("Formatted Orders:", formattedOrders); // Debugging log

        res.status(200).json({ orders: formattedOrders });
    } catch (error) {
        console.error("Error in getAllOrders:", error); // Log error details
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
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

module.exports.cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const userId = req.user.id;

        // Find the order
        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Allow cancellation only if order is 'Pending' or 'Processing'
        if (order.status !== "Pending" && order.status !== "Processing") {
            return res.status(400).json({ error: "Order cannot be canceled at this stage" });
        }

        // Restore stock for each product in the order
        for (let item of order.productsOrdered) {
            const product = await Product.findById(item.productId);

            if (product) {
                product.quantity += item.quantity; // ✅ Restock
                await product.save();
            }
        }

        // Update order status to 'Canceled'
        order.status = "Cancelled";
        await order.save();

        res.status(200).json({ message: "Order canceled successfully, stock restored", order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
