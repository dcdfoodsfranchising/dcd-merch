/**
 * @file models/Cart.js
 * @description Mongoose schema and model for managing user carts.
 * Includes selected product variants, quantities, subtotals, and total cart price.
 */

const mongoose = require('mongoose');

/**
 * @typedef Variant
 * @property {String} name - Name or label for the variant (e.g., "T-shirt Variant A")
 * @property {String} size - Optional size attribute (e.g., "Medium")
 * @property {String} color - Optional color attribute (e.g., "Blue")
 * @property {Number} price - Price of the specific variant
 * @property {Number} quantity - Stock available for this variant (for validation/tracking)
 */
const variantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  size: { 
    type: String, 
    required: false 
  },
  color: { 
    type: String, 
    required: false 
  },
  price: { 
    type: Number, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 0 
  }
}, { _id: false }); // Embedded schema, no _id needed

/**
 * @typedef CartItem
 * @property {mongoose.ObjectId} productId - Reference to the main product
 * @property {Variant} variant - Specific variant chosen by the user
 * @property {Number} quantity - Quantity of this item in the cart
 * @property {Number} subtotal - Subtotal (variant.price × quantity)
 */
const cartItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  variant: { 
    type: variantSchema, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  subtotal: { 
    type: Number, 
    required: true 
  }
});

/**
 * @typedef Cart
 * @property {mongoose.ObjectId} userId - The user who owns this cart
 * @property {CartItem[]} cartItems - Array of items added to the cart
 * @property {Number} totalPrice - Total cost of all items in the cart
 * @property {Date} orderedOn - Timestamp of when the cart was last ordered
 */
const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  cartItems: [cartItemSchema], // Items currently in the cart
  totalPrice: { 
    type: Number, 
    required: true 
  },
  orderedOn: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Cart', cartSchema);
