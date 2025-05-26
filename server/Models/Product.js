const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: false
  },
  color: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  }
}, { _id: false });

// Custom validation to ensure at least size or color is defined
variantSchema.pre('validate', function (next) {
  if (!this.size && !this.color) {
    next(new Error('At least size or color must be specified for a variant.'));
  } else {
    next();
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  images: {
    type: [String]
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
