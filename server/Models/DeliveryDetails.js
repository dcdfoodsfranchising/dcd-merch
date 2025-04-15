const mongoose = require('mongoose');

const deliveryDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  barangay: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  completeAddress: { type: String, required: true },
  tag: { type: String }, // Optional: home, office, etc.
  notesForRider: { type: String } // Optional
}, {
  timestamps: true
});

module.exports = mongoose.model('DeliveryDetails', deliveryDetailsSchema);
