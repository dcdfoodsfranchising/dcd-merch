const mongoose = require('mongoose');

// Variant schema for cart items (based on Product model's variantSchema)
const variantSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Small", "Medium", "Large"
    price: { type: Number, required: true }, // Price of the selected variant
    quantity: { type: Number, required: true, default: 0 } // Quantity available in stock
});

// Cart item schema
const cartItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    variant: { 
        type: variantSchema, // Embed the variant schema
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