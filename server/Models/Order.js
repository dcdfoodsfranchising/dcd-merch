const mongoose = require('mongoose');

// ✅ Define deliveryDetailsSchema FIRST
const deliveryDetailsSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    contactNumber: String,
    houseNumber: String,
    street: String,
    barangay: String,
    municipality: String,
    city: String,
    postalCode: String
}, { _id: false }); // No need for its own _id since it's embedded

// ✅ Now define the Order schema and use deliveryDetailsSchema
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
  }],
  deliveryDetails: deliveryDetailsSchema // ✅ No more ReferenceError
}));

module.exports = Order;
