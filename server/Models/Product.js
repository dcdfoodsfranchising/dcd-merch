const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Small, Medium, Large
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  images: { 
    type: [String], 
    required: false 
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  variants: [variantSchema]
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
