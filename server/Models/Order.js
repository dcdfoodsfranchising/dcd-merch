const mongoose = require('mongoose');

// Define the schema for individual products ordered
const productOrderedSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
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

// Define the schema for the order status history
const statusHistorySchema = new mongoose.Schema({
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], // List of valid statuses
    required: true 
  },
  changedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the user or admin who changed the status
    required: true 
  },
  changedOn: { 
    type: Date, 
    default: Date.now 
  }
});

// Define the main order schema
const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productsOrdered: [productOrderedSchema], // Array of ordered products
  totalPrice: { 
    type: Number, 
    required: true 
  },
  orderedOn: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  statusHistory: [statusHistorySchema], // Array to track the status history of the order
});

module.exports = mongoose.model('Order', orderSchema);
