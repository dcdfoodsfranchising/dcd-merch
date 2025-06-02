const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vote: { type: String, enum: ["up", "down"], required: true }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  images: [String], 
  isVerifiedPurchase: { type: Boolean, default: true },
  helpfulVotes: { type: Number, default: 0 },
  notHelpfulVotes: { type: Number, default: 0 },
  votes: [voteSchema], // <-- Add this line
  reply: replySchema, 
  isAnonymous: { type: Boolean, default: false },
  tags: [String], 
  reported: { type: Boolean, default: false },
  hidden: { type: Boolean, default: false },  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);