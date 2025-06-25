/**
 * @file models/DeliveryDetails.js
 * @description Mongoose schema and model for storing a user's saved delivery addresses.
 * Includes tagging (home, office, etc.), contact info, and optional rider notes.
 */

const mongoose = require('mongoose');

/**
 * @typedef DeliveryDetails
 * @property {mongoose.ObjectId} user - Reference to the user who owns this address
 * @property {String} firstName - Recipient's first name
 * @property {String} lastName - Recipient's last name
 * @property {String} contactNumber - Phone number for delivery contact
 * @property {String} barangay - Barangay or subdivision
 * @property {String} city - City or municipality
 * @property {String} postalCode - Zip or postal code
 * @property {String} completeAddress - Full street address
 * @property {String} tag - Optional label (e.g., 'home', 'office')
 * @property {String} notesForRider - Optional delivery notes for the rider
 * @property {Date} createdAt - Timestamp for creation (auto-managed)
 * @property {Date} updatedAt - Timestamp for last update (auto-managed)
 */

const deliveryDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Links delivery address to a specific user
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  barangay: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  postalCode: { 
    type: String, 
    required: true 
  },
  completeAddress: { 
    type: String, 
    required: true 
    // Includes house number, street, building, etc.
  },
  tag: { 
    type: String 
    // Optional label (e.g., 'Home', 'Work')
  },
  notesForRider: { 
    type: String 
    // Optional instructions (e.g., "Leave at front desk")
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('DeliveryDetails', deliveryDetailsSchema);
