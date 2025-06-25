/**
 * @file models/Review.js
 * @description Mongoose schema and model for user-submitted product reviews. 
 * Includes rating, comment, media, helpful votes, admin/seller replies, 
 * and moderation features like reporting or hiding.
 */

const mongoose = require('mongoose');

/**
 * @typedef Reply
 * @property {mongoose.ObjectId} userId - Reference to the user who replied (usually seller/admin)
 * @property {String} comment - The reply message content
 * @property {Date} createdAt - Timestamp of the reply
 */
const replySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  comment: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: false }); // Prevents subdocument from generating its own _id

/**
 * @typedef Vote
 * @property {mongoose.ObjectId} userId - User who voted
 * @property {String} vote - Either "up" or "down"
 */
const voteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  vote: { 
    type: String, 
    enum: ["up", "down"], 
    required: true 
  }
}, { _id: false });

/**
 * @typedef Review
 * @property {mongoose.ObjectId} productId - Associated product
 * @property {mongoose.ObjectId} userId - Author of the review
 * @property {mongoose.ObjectId} orderId - Order that confirms the purchase
 * @property {Number} rating - Rating value (1 to 5)
 * @property {String} comment - Optional review text
 * @property {String[]} images - Optional image URLs or paths
 * @property {Boolean} isVerifiedPurchase - Flag to confirm if the user purchased the product
 * @property {Number} helpfulVotes - Number of helpful votes
 * @property {Number} notHelpfulVotes - Number of not-helpful votes
 * @property {Vote[]} votes - Array of user votes
 * @property {Reply} reply - Optional seller/admin reply to the review
 * @property {Boolean} isAnonymous - If true, review is anonymous
 * @property {String[]} tags - Optional tags (e.g., "fast shipping", "poor packaging")
 * @property {Boolean} reported - If true, review is reported
 * @property {Boolean} hidden - If true, review is hidden (e.g., by moderation)
 * @property {Date} createdAt - Timestamp of review creation
 */
const reviewSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Order", 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  comment: { 
    type: String 
  },
  images: [String], // Array of uploaded image file paths or URLs
  isVerifiedPurchase: { 
    type: Boolean, 
    default: true 
  },
  helpfulVotes: { 
    type: Number, 
    default: 0 
  },
  notHelpfulVotes: { 
    type: Number, 
    default: 0 
  },
  votes: [voteSchema], // List of individual votes from users
  reply: replySchema,  // Optional reply from admin/seller
  isAnonymous: { 
    type: Boolean, 
    default: false 
  },
  tags: [String], // Optional metadata tags (e.g., "durable", "as described")
  reported: { 
    type: Boolean, 
    default: false 
  },
  hidden: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Export the model, using a fallback to prevent re-registration in dev environments
module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);
