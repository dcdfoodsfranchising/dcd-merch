const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const auth = require('../middlewares/auth')
const bcrypt = require('bcryptjs');
const { errorHandler } = auth;


// Get cart items
module.exports.getCartItems = async (req, res) => {
    try {
        // Find the cart for the logged-in user and populate product details
        const cart = await Cart.findOne({ userId: req.user.id })
            .populate({
                path: 'cartItems.productId',
                select: 'name description price variants' // Include necessary fields from the Product model
            });

        // If cart not found, return 404
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartDetails = {
            _id: cart._id,
            userId: cart.userId,
            cartItems: cart.cartItems.map(item => {
                const product = item.productId;
                const variant = product.variants.find(v => v.name === item.variant.name);

                return {
                    productId: {
                        _id: product._id,
                        name: product.name,
                        description: product.description,
                        price: product.price
                    },
                    variant: {
                        name: item.variant.name,
                        price: item.variant.price,
                        quantity: item.variant.quantity,
                        availableStock: variant ? variant.quantity : 0 // Include stock from the Product model
                    },
                    quantity: item.quantity,
                    subtotal: item.subtotal,
                    _id: item._id
                };
            }),
            totalPrice: cart.totalPrice,
            orderedOn: cart.orderedOn,
            __v: cart.__v
        };

        // Send the formatted cart details in the response
        res.status(200).json({ cart: cartDetails });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Add item to cart
module.exports.addToCart = async (req, res) => {
    try {
        const { productId, variantName, quantity } = req.body;
        const userId = req.user.id;

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, cartItems: [], totalPrice: 0 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the variant
        const variant = product.variants.find(v => v.name === variantName);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        // Check if requested quantity exceeds available stock
        if (quantity > variant.quantity) {
            return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
        }

        const subtotal = variant.price * quantity;

        // Check if the item already exists in the cart
        const itemIndex = cart.cartItems.findIndex(item =>
            item.productId.toString() === productId &&
            item.variant.name === variantName
        );

        if (itemIndex > -1) {
            // Update quantity and subtotal if item exists
            cart.cartItems[itemIndex].quantity += quantity;
            cart.cartItems[itemIndex].subtotal += subtotal;
        } else {
            // Add new item to the cart
            cart.cartItems.push({
                productId,
                variant: {
                    name: variant.name,
                    price: variant.price,
                    quantity: variant.quantity
                },
                quantity,
                subtotal
            });
        }

        // Update total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: 'Item added to cart successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Update item quantity in cart
module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { productId, variantName, quantity } = req.body;
        const userId = req.user.id;

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.cartItems.findIndex(item =>
            item.productId.toString() === productId &&
            item.variant.name === variantName
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Retrieve the product and variant
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const variant = product.variants.find(v => v.name === variantName);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        // Check if requested quantity exceeds available stock
        if (quantity > variant.quantity) {
            return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
        }

        // Update the quantity and subtotal of the item
        cart.cartItems[itemIndex].quantity = quantity;
        cart.cartItems[itemIndex].subtotal = variant.price * quantity;

        // Recalculate the total price of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: 'Item quantity updated successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item quantity', error });
    }
};

// Remove item from cart
module.exports.removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, variantName } = req.body;

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.cartItems.findIndex(item =>
            item.productId.toString() === productId &&
            item.variant.name === variantName
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the item from the cart
        cart.cartItems.splice(itemIndex, 1);

        // Update the total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: 'Item removed from cart successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Clear the cart
module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Clear all items from the cart
        cart.cartItems = [];
        cart.totalPrice = 0;

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: 'Cart cleared successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};