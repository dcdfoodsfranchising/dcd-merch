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
          select: 'name description images variants'
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
  
          // Find the matching variant using price, size, and color (fallback to empty string or undefined if not present)
          const matchingVariant = product.variants.find(v =>
            v.price === item.variant.price &&
            v.size === item.variant.size &&
            v.color === item.variant.color
          );
  
          return {
            _id: item._id,
            productId: {
              _id: product._id,
              name: product.name,
              description: product.description,
              images: product.images
            },
            variant: {
              size: item.variant.size ?? (matchingVariant?.size ?? ''),
              color: item.variant.color ?? (matchingVariant?.color ?? ''),
              price: item.variant.price,
              quantity: item.variant.quantity,
              availableStock: matchingVariant?.quantity ?? 0
            },
            quantity: item.quantity,
            subtotal: item.subtotal
          };
        }),
        totalPrice: cart.totalPrice,
        orderedOn: cart.orderedOn,
        __v: cart.__v
      };
  
      res.status(200).json({ cart: cartDetails });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
  
  

// Add item to cart
module.exports.addToCart = async (req, res) => {
    try {
        const { productId, size, color, quantity } = req.body;
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

        // Match variant by size and color
        const variant = product.variants.find(v => v.size === size && v.color === color);
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        // Build variant name from size and color
        const variantName = `${size} ${color}`.trim();

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
            cart.cartItems[itemIndex].quantity += quantity;
            cart.cartItems[itemIndex].subtotal += subtotal;
        } else {
            cart.cartItems.push({
                productId,
                variant: {
                  size: variant.size,
                  color: variant.color,
                  price: variant.price,
                  quantity: variant.quantity
                },
                quantity,
                subtotal
              });
              
        }

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

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
        const { productId, size, color, quantity } = req.body;
        const userId = req.user.id;

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the cart item using productId, size, and color
        const itemIndex = cart.cartItems.findIndex(item =>
            item.productId.toString() === productId &&
            item.variant.size === size &&
            item.variant.color === color
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Retrieve the product and find the exact variant
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const variant = product.variants.find(v =>
            v.size === size &&
            v.color === color
        );

        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }

        // Check if the new quantity exceeds stock
        if (quantity > variant.quantity) {
            return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
        }

        // Update the item's quantity and subtotal
        cart.cartItems[itemIndex].quantity = quantity;
        cart.cartItems[itemIndex].subtotal = variant.price * quantity;

        // Recalculate total cart price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        await cart.save();

        res.status(200).json({
            message: 'Item quantity updated successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item quantity', error: error.message });
    }
};


// Remove item from cart
module.exports.removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, size, color } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.cartItems.findIndex(item =>
            item.productId.toString() === productId &&
            item.variant.size === size &&
            item.variant.color === color
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the item
        cart.cartItems.splice(itemIndex, 1);

        // Update total price
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

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