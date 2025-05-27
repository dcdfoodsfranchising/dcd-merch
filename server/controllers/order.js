const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const Order = require("../Models/Order");
const DeliveryDetails = require("../Models/DeliveryDetails");
const auth = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const express = require('express');
const mongoose = require('mongoose');
const {  emitNewOrder, emitProductUpdate } = require("../socket");
const { errorHandler } = auth;


module.exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user's cart and delivery details
        const cart = await Cart.findOne({ userId }).populate("cartItems.productId");
        const deliveryDetails = req.body.deliveryDetails;
        if (!deliveryDetails) {
            return res.status(400).json({ message: "No delivery details provided." });
        }

        if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
            return res.status(404).json({ message: "No items in the cart to checkout" });
        }

        let totalPrice = 0;
        const productsOrdered = [];

        for (let item of cart.cartItems) {
            if (!item.productId || !item.productId._id) {
                return res.status(400).json({ error: `Invalid product reference in cart.` });
            }

            const product = await Product.findById(item.productId._id);
            if (!product) {
                return res.status(404).json({ error: `Product not found: ${item.productId._id}` });
            }

            // Find matching variant (by color and size if present)
            let variant;
            if (item.variant && item.variant.color && item.variant.size) {
                variant = product.variants.find(
                    v => v.color === item.variant.color && v.size === item.variant.size
                );
            } else if (item.variant && item.variant.name) {
                variant = product.variants.find(v => v.name === item.variant.name);
            } else {
                variant = undefined;
            }

            if (product.variants.length > 0 && !variant) {
                return res.status(400).json({ error: `Matching variant not found for ${product.name}` });
            }
            if (variant.quantity < item.quantity) {
                return res.status(400).json({
                    error: `Not enough stock for ${product.name} - ${variant.name}. Available: ${variant.quantity}`
                });
            }
            variant.quantity -= item.quantity;
            await product.save();


            // ✅ Emit product update event
            emitProductUpdate(product);

            productsOrdered.push({
                productId: product._id,
                quantity: item.quantity,
                subtotal: item.subtotal,
                size: item.variant?.size || null,   // <-- Add this
                color: item.variant?.color || null  // <-- Add this
            });

            totalPrice += item.subtotal;
        }

        const order = new Order({
            userId,
            productsOrdered,
            totalPrice,
            status: "Pending",
            deliveryDetails: {
                firstName: deliveryDetails.firstName,
                lastName: deliveryDetails.lastName,
                contactNumber: deliveryDetails.contactNumber,
                barangay: deliveryDetails.barangay,
                city: deliveryDetails.city,
                postalCode: deliveryDetails.postalCode,
                // Add other fields as needed
                completeAddress: deliveryDetails.completeAddress,
                tag: deliveryDetails.tag,
                notesForRider: deliveryDetails.notesForRider
            }
        });

        await order.save();

        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        const fullOrder = await Order.findById(order._id)
            .populate({ path: "userId", select: "firstName lastName email" })
            .populate({ path: "productsOrdered.productId", select: "name description price" })
            .populate("deliveryDetails"); // Fetch embedded delivery details

        emitNewOrder(fullOrder); // ✅ Emit full order details

        res.status(201).json({
            message: "Order placed successfully",
            order: fullOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Add this to your order.js controller
module.exports.createDirectOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, color, size, quantity, deliveryDetails } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let subtotal = 0;
        let orderedProduct = {
            productId: product._id,
            quantity,
        };

        // Only look for variant if color and size are provided and product has variants
        if (
            product.variants &&
            product.variants.length > 0 &&
            color &&
            size
        ) {
            const variant = product.variants.find(
                v => v.color === color && v.size === size
            );
            if (!variant) {
                return res.status(400).json({ error: `Variant with color '${color}' and size '${size}' not found for ${product.name}` });
            }
            if (variant.quantity < quantity) {
                return res.status(400).json({ error: `Not enough stock for ${product.name} - ${variant.color} / ${variant.size}` });
            }
            variant.quantity -= quantity;
            await product.save();

            subtotal = variant.price * quantity;
            orderedProduct.color = color;
            orderedProduct.size = size;
            orderedProduct.subtotal = subtotal;
        } else {
            // No variants or no color/size: use product price and update stock if you track it
            if (product.quantity < quantity) {
                return res.status(400).json({ error: `Not enough stock for ${product.name}` });
            }
            product.quantity -= quantity;
            await product.save();

            subtotal = product.price * quantity;
            orderedProduct.subtotal = subtotal;
        }

        const order = new Order({
            userId,
            productsOrdered: [orderedProduct],
            totalPrice: subtotal,
            status: "Pending",
            deliveryDetails
        });

        await order.save();

        // Populate product details for the response
        const fullOrder = await Order.findById(order._id)
            .populate({
                path: "productsOrdered.productId",
                select: "name price images description"
            });

        res.status(201).json({
            message: "Order placed successfully",
            order: fullOrder
        });
    } catch (error) {
        console.error("createDirectOrder error:", error); // <--- Add this line
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports.buyAgainOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, color, size, quantity, price, deliveryDetails } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let subtotal = 0;
        let orderedProduct = {
            productId: product._id,
            quantity,
        };

        // If product has variants, require color and size
        if (product.variants && product.variants.length > 0) {
            if (!color || !size) {
                return res.status(400).json({ error: "This product requires color and size to order." });
            }
            const variant = product.variants.find(
                v => v.color === color && v.size === size
            );
            if (!variant) {
                return res.status(400).json({ error: `Variant with color '${color}' and size '${size}' not found for ${product.name}` });
            }
            if (variant.quantity < quantity) {
                return res.status(400).json({ error: `Not enough stock for ${product.name} - ${variant.color} / ${variant.size}` });
            }
            variant.quantity -= quantity;
            await product.save();

            subtotal = (price || variant.price) * quantity; // Use original price if provided, else current
            orderedProduct.color = color;
            orderedProduct.size = size;
            orderedProduct.price = price || variant.price;
            orderedProduct.subtotal = subtotal;
        } else {
            // No variants
            if (product.quantity < quantity) {
                return res.status(400).json({ error: `Not enough stock for ${product.name}` });
            }
            product.quantity -= quantity;
            await product.save();

            subtotal = (price || product.price) * quantity; // Use original price if provided, else current
            orderedProduct.price = price || product.price;
            orderedProduct.subtotal = subtotal;
        }

        const order = new Order({
            userId,
            productsOrdered: [orderedProduct],
            totalPrice: subtotal,
            status: "Pending",
            deliveryDetails
        });

        await order.save();

        const fullOrder = await Order.findById(order._id)
            .populate({
                path: "productsOrdered.productId",
                select: "name price images description"
            });

        res.status(201).json({
            message: "Buy Again order placed successfully",
            order: fullOrder
        });
    } catch (error) {
        console.error("buyAgainOrder error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports.getOrders = async (req, res) => {
  try {
    // Fetch orders for the logged-in user and populate product details
    const orders = await Order.find({ userId: req.user.id }).populate({
      path: 'productsOrdered.productId',
      select: 'name description price images',
      model: 'Product'
    });

    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: 'No orders found', orders: [] });
    }

    res.status(200).json({
      orders: orders.map(order => ({
        _id: order._id,
        orderedOn: order.orderedOn,
        status: order.status,
        totalPrice: order.totalPrice,
        deliveryDetails: order.deliveryDetails,
        productsOrdered: order.productsOrdered.map(item => ({
          productId: item.productId?._id,
          name: item.productId?.name,
          description: item.productId?.description,
          price: item.productId?.price,
          images: item.productId?.images,
          quantity: item.quantity,
          subtotal: item.subtotal,
          size: item.size || null,
          color: item.color || null
        }))
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


module.exports.getAllOrders = async (req, res) => {
    try {
        console.log("Fetching all orders...");

        const orders = await Order.find()
            .populate({
                path: "productsOrdered.productId",
                model: "Product", // ✅ Explicitly specify the model
                select: "name description price"
            })
            .populate({
                path: "userId",
                select: "firstName lastName email"
            });

        console.log("Orders fetched from DB:", orders); // Debugging log

        if (!orders || orders.length === 0) {
            return res.status(200).json({ message: "No orders found", orders: [] });
        }

        const formattedOrders = orders.map(order => ({
            _id: order._id,
            user: {
                userId: order.userId?._id,
                name: `${order.userId?.firstName || "Unknown"} ${order.userId?.lastName || ""}`,
                email: order.userId?.email || "No Email"
            },
            productsOrdered: order.productsOrdered.map(item => ({
                productId: item?.productId?._id || "Unknown",
                name: item?.productId?.name || "Unknown Product",
                description: item?.productId?.description || "No Description",
                price: item?.productId?.price || 0,
                quantity: item.quantity,
                subtotal: item.subtotal
            })),
            totalPrice: order.totalPrice,
            status: order.status,
            orderedOn: order.orderedOn,
            statusHistory: order.statusHistory
        }));

        console.log("Formatted Orders:", formattedOrders);
        res.status(200).json({ orders: formattedOrders });
    } catch (error) {
        console.error("Error in getAllOrders:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
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
                const variant = product.variants.find(v => v.name === item.variantName);
                if (variant) {
                    variant.quantity += item.quantity;
                    await product.save();
                }
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
