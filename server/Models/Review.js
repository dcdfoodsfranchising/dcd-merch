const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  images: [String], // URLs to uploaded images
  isVerifiedPurchase: { type: Boolean, default: true },
  helpfulVotes: { type: Number, default: 0 },
  notHelpfulVotes: { type: Number, default: 0 },
  reply: replySchema, // Admin or seller reply
  isAnonymous: { type: Boolean, default: false },
  tags: [String], // e.g. ["Good quality", "Fast shipping"]
  reported: { type: Boolean, default: false }, // For moderation
  hidden: { type: Boolean, default: false },   // Admin can hide inappropriate reviews
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);