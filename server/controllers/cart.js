const Cart = require("../Models/Cart");
const Product = require("../Models/Product");
const auth = require('../auth')
const bcrypt = require('bcryptjs');
const { errorHandler } = auth;


// Get cart items
module.exports.getCartItems = async (req, res) => {
    try {
        // Find the cart for the logged-in user and populate product details
        const cart = await Cart.findOne({ userId: req.user.id })
            .populate({
                path: 'cartItems.productId',
                select: 'name description price' // Include the necessary fields from the Product model
            });
        
        // If cart not found, return 404
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartDetails = {
            _id: cart._id,
            userId: cart.userId,
            cartItems: cart.cartItems.map(item => ({
                productId: {
                    _id: item.productId._id,
                    name: item.productId.name,
                    description: item.productId.description,
                    price: item.productId.price
                },
                quantity: item.quantity,
                subtotal: item.subtotal,
                _id: item._id
            })),
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
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Check if quantity is a number and greater than 0
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        // Find the cart for the user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({ userId, cartItems: [], totalPrice: 0 });
        }

        // Retrieve the product's price from the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate the subtotal (price * quantity)
        const subtotal = product.price * quantity;

        // Check if the product already exists in the cart
        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // If the product exists, update the quantity and subtotal
            cart.cartItems[itemIndex].quantity += quantity;
            cart.cartItems[itemIndex].subtotal += subtotal;
        } else {
            // If the product does not exist, add it to the cart
            cart.cartItems.push({ productId, quantity, subtotal });
        }

        // Update the total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the cart
        await cart.save();

        res.status(200).json({
            message: 'Item added to cart successfully',
            cart: {
                _id: cart._id,
                userId: cart.userId,
                cartItems: cart.cartItems,
                totalPrice: cart.totalPrice,
                orderedOn: cart.orderedOn
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};



// Update item quantity in cart
module.exports.updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body; // Removed subtotal from the request body
        const userId = req.user.id;

        // Validate quantity to ensure it's a valid number and greater than 0
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        // Find the cart for the user
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the item in the cart
        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Retrieve the product's price from the database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate the new subtotal (price * quantity)
        const newSubtotal = product.price * quantity;

        // Update the quantity and subtotal of the item
        cart.cartItems[itemIndex].quantity = quantity;
        cart.cartItems[itemIndex].subtotal = newSubtotal;

        // Recalculate the total price of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: 'Item quantity updated successfully',
            updatedCart: {
                _id: cart._id,
                userId: cart.userId,
                cartItems: cart.cartItems,
                totalPrice: cart.totalPrice,
                orderedOn: cart.orderedOn
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item quantity', error });
    }
};



//  Remove item from cart
module.exports.removeCartItem = async (req, res) => {
    try {

        const userId = req.user.id; 
        const productId = req.params.productId;


        // Find the cart for the user
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Check if the product exists in the cart
        const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(400).json({ message: 'Item not found in cart' });
        }

        // Remove the item from the cart
        cart.cartItems.splice(itemIndex, 1);

        // Update the total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            message: 'Item removed from cart successfully',
            cart: {
                _id: cart._id,
                userId: cart.userId,
                cartItems: cart.cartItems,
                totalPrice: cart.totalPrice,
                orderedOn: cart.orderedOn
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

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
            cart: {
                _id: cart._id,
                userId: cart.userId,
                cartItems: cart.cartItems,
                totalPrice: cart.totalPrice,
                orderedOn: cart.orderedOn,
                __v: cart.__v
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
