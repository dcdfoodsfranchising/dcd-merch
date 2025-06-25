/**
 * @file models/Order.js
 * @description Mongoose schema and model for handling customer orders.
 * Includes embedded delivery address, product references, order status, and tracking history.
 */

const mongoose = require('mongoose');

/**
 * @typedef DeliveryDetails
 * @property {String} firstName - Recipient's first name
 * @property {String} lastName - Recipient's last name
 * @property {String} email - Contact email address
 * @property {String} contactNumber - Contact phone number
 * @property {String} houseNumber - House/Unit number
 * @property {String} street - Street name
 * @property {String} barangay - Barangay or village
 * @property {String} municipality - Municipality or district
 * @property {String} city - City
 * @property {String} postalCode - Zip/postal code
 */
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
}, { _id: false }); // Embedded, so no separate _id

/**
 * @typedef OrderedProduct
 * @property {mongoose.ObjectId} productId - Reference to the ordered product
 * @property {Number} quantity - Quantity of this product ordered
 * @property {Number} subtotal - Subtotal price for this item (quantity × unit price)
 */

/**
 * @typedef OrderStatusHistory
 * @property {String} status - Status at a specific point in time
 * @property {mongoose.ObjectId} changedBy - User who changed the status (admin or system)
 * @property {Date} changedOn - When the change occurred
 */

/**
 * @typedef Order
 * @property {mongoose.ObjectId} userId - Reference to the user placing the order
 * @property {OrderedProduct[]} productsOrdered - Array of products ordered
 * @property {Number} totalPrice - Total cost of the order
 * @property {Date} orderedOn - Timestamp of order creation
 * @property {String} status - Current status of the order
 * @property {OrderStatusHistory[]} statusHistory - Change log of order statuses
 * @property {DeliveryDetails} deliveryDetails - Embedded object for shipping information
 */

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

  deliveryDetails: deliveryDetailsSchema
}));

module.exports = Order;
