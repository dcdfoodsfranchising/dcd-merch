const Review = require("../Models/Review");
const Order = require("../Models/Order");

// Create a review
exports.createReview = async (req, res) => {
  console.log(req.body, req.files)
  try {
    let { productId, orderId, rating, comment, isAnonymous, tags } = req.body;
    const userId = req.user.id;
    const images = req.files ? req.files.map(file => file.path) : [];

    // Parse tags if sent as JSON string
    if (Array.isArray(tags)) {
      // tags is already an array (from multiple form fields)
    } else if (typeof tags === "string") {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [tags];
      }
    }

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
    const { vote } = req.body; // vote: "up" or "down"
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    // Ensure votes array exists
    if (!Array.isArray(review.votes)) review.votes = [];

    // Find existing vote by this user
    const existingVoteIndex = review.votes.findIndex(v => v.userId.toString() === userId);

    let message = "";

    if (existingVoteIndex === -1) {
      // User hasn't voted yet, add vote
      review.votes.push({ userId, vote });
      if (vote === "up") review.helpfulVotes += 1;
      if (vote === "down") review.notHelpfulVotes += 1;
      message = "Vote recorded.";
    } else {
      const prevVote = review.votes[existingVoteIndex].vote;
      if (prevVote === vote) {
        // User clicked same vote again, remove vote (toggle/cancel)
        review.votes.splice(existingVoteIndex, 1);
        if (vote === "up") review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
        if (vote === "down") review.notHelpfulVotes = Math.max(0, review.notHelpfulVotes - 1);
        message = "Vote cancelled.";
      } else {
        // User switched vote
        review.votes[existingVoteIndex].vote = vote;
        if (vote === "up") {
          review.helpfulVotes += 1;
          review.notHelpfulVotes = Math.max(0, review.notHelpfulVotes - 1);
        } else if (vote === "down") {
          review.notHelpfulVotes += 1;
          review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
        }
        message = "Vote updated.";
      }
    }

    await review.save();
    res.json({ message, review });
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