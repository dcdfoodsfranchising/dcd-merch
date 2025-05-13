const mongoose = require('mongoose');

// Variant schema for cart items (based on updated Product variant structure)
const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    size: { type: String, required: false },   // e.g., "Small"
    color: { type: String, required: false },  // e.g., "Red"
    price: { type: Number, required: true },   // Price of the selected variant
    quantity: { type: Number, required: true, default: 0 } // Quantity available in stock
}, { _id: false });

// Cart item schema
const cartItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    variant: { 
        type: variantSchema, // Embed the updated variant schema
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

// Cart schema
const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    cartItems: [cartItemSchema], // Array of cart items
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
