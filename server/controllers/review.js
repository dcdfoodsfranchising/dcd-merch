const Review = require("../Models/Review");
const Order = require("../Models/Order");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment, isAnonymous, tags } = req.body;
    const userId = req.user.id;
    const images = req.files ? req.files.map(file => file.path) : [];

    // Check if order is delivered and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId,
      status: "Delivered",
      "productsOrdered.productId": productId
    });

    if (!order) {
      return res.status(400).json({ message: "You can only review delivered products you purchased." });
    }

    // Prevent duplicate review for same product/order/user
    const existing = await Review.findOne({ productId, orderId, userId });
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this product for this order." });
    }

    const review = new Review({
      productId,
      userId,
      orderId,
      rating,
      comment,
      images,
      isVerifiedPurchase: true,
      isAnonymous: !!isAnonymous,
      tags
    });

    await review.save();
    res.status(201).json({ message: "Review submitted!", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review.", error: error.message });
  }
};

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId, hidden: false })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: error.message });
  }
};

// Mark review as helpful/not helpful
exports.voteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body; // true = helpful, false = not helpful

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    if (helpful) review.helpfulVotes += 1;
    else review.notHelpfulVotes += 1;

    await review.save();
    res.json({ message: "Vote recorded.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to vote.", error: error.message });
  }
};

// Admin/seller reply to a review
exports.replyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    review.reply = {
      userId,
      comment,
      createdAt: new Date()
    };

    await review.save();
    res.json({ message: "Reply added.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to reply.", error: error.message });
  }
};

// Edit a review (user only)
exports.editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, isAnonymous, tags } = req.body;
    const userId = req.user.id;
    const images = req.files ? req.files.map(file => file.path) : undefined;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review) return res.status(404).json({ message: "Review not found or not yours." });

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (typeof isAnonymous !== "undefined") review.isAnonymous = isAnonymous;
    if (tags) review.tags = tags;
    if (images && images.length > 0) review.images = images;

    await review.save();
    res.json({ message: "Review updated.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review.", error: error.message });
  }
};

// Delete a review (user or admin)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    // Only allow user or admin to delete
    if (review.userId.toString() !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review.", error: error.message });
  }
};

// Report a review (user)
exports.reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    review.reported = true;
    await review.save();
    res.json({ message: "Review reported." });
  } catch (error) {
    res.status(500).json({ message: "Failed to report review.", error: error.message });
  }
};

// Admin: Hide/unhide a review
exports.setReviewHidden = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { hidden } = req.body;

    // Only admin should be able to do this (add your admin check)
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { hidden: !!hidden },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: "Review not found." });

    res.json({ message: `Review ${hidden ? "hidden" : "unhidden"}.`, review });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review visibility.", error: error.message });
  }
};