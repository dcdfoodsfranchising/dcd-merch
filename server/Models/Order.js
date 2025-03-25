const mongoose = require('mongoose');

// Check if the model already exists before defining it
const Order = mongoose.models.Order || mongoose.model('Order', new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productsOrdered: [{
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
  }],
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
  statusHistory: [{
    status: { 
      type: String, 
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      required: true 
    },
    changedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    changedOn: { 
      type: Date, 
      default: Date.now 
    }
  }]
}));

module.exports = Order;
