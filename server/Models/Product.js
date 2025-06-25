/**
 * @file models/Product.js
 * @description Mongoose schema and model for storing product information, 
 * including multiple variants (e.g., sizes or colors), pricing, stock, 
 * image assets, and product activity status.
 */

const mongoose = require('mongoose');

/**
 * @typedef Variant
 * @property {String} size - Optional size label for the variant (e.g., "M", "Large")
 * @property {String} color - Optional color label for the variant (e.g., "Red", "Black")
 * @property {Number} price - Price of this specific variant (required)
 * @property {Number} quantity - Available stock for this variant (default: 0)
 */
const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: false // Optional
  },
  color: {
    type: String,
    required: false // Optional
  },
  price: {
    type: Number,
    required: true // Price must be set for each variant
  },
  quantity: {
    type: Number,
    required: true,
    default: 0 // Default stock is 0
  }
}, { _id: false }); // Prevent subdocument _id generation

/**
 * Custom validation hook to ensure that at least
 * `size` or `color` is specified for a variant.
 */
variantSchema.pre('validate', function (next) {
  if (!this.size && !this.color) {
    next(new Error('At least size or color must be specified for a variant.'));
  } else {
    next();
  }
});

/**
 * @typedef Product
 * @property {String} name - Product name (required)
 * @property {String} description - Optional product description
 * @property {String[]} images - Array of image URLs or file paths
 * @property {Boolean} isFeatured - Whether the product is featured on the homepage or promo section
 * @property {Boolean} isActive - Whether the product is currently available for purchase
 * @property {Date} createdOn - Date when the product was added
 * @property {Variant[]} variants - Array of product variants (each with size, color, price, quantity)
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Name is mandatory
  },
  description: {
    type: String // Optional detailed description
  },
  images: {
    type: [String] // Array of image URLs or file paths
  },
  isFeatured: {
    type: Boolean,
    default: false // Used to highlight selected products
  },
  isActive: {
    type: Boolean,
    default: true // Controls if the product should be shown in listings
  },
  createdOn: {
    type: Date,
    default: Date.now // Auto-sets creation date
  },
  variants: [variantSchema] // List of different options per product
});

// Export the Product model (preventing re-registration in dev environments)
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
