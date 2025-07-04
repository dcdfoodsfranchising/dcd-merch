const Review = require("../Models/Review");
const Order = require("../Models/Order");
const cloudinary = require("../config/cloudinary");

// Create a review
exports.createReview = async (req, res) => {
  try {
    let { productId, orderId, rating, comment, isAnonymous, tags } = req.body;
    const userId = req.user.id;
    let images = [];

    // Upload each file to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "reviews"
        });
        images.push(uploadResult.secure_url);
      }
    }

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
      images, // Now contains Cloudinary URLs
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
    const userId = req.user?.id;
    const reviews = await Review.find({ productId: req.params.productId, hidden: false })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });

    // Deduplicate: keep only the latest review per user/order/product
    const seen = new Set();
    const uniqueReviews = [];
    for (const r of reviews) {
      const userIdStr = r.userId && typeof r.userId === "object" ? r.userId._id.toString() : r.userId?.toString();
      const key = `${userIdStr}-${r.orderId}-${r.productId}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueReviews.push(r);
      }
    }

    // Add userVote field and mask username if anonymous
    const reviewsWithUserVote = uniqueReviews.map(r => {
      let userVote = null;
      if (userId && r.votes && Array.isArray(r.votes)) {
        const found = r.votes.find(v => v.userId.toString() === userId);
        if (found) userVote = found.vote;
      }
      const reviewObj = r.toObject();
      // Mask username if anonymous
      if (reviewObj.isAnonymous && reviewObj.userId) {
        reviewObj.userId = {
          ...reviewObj.userId,
          username: "Anonymous",
        };
      }
      return {
        ...reviewObj,
        userVote,
      };
    });

    res.json(reviewsWithUserVote);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: error.message });
  }
};

// Mark review as helpful/not helpful
exports.voteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { vote } = req.body; // "up" or "down"
    const userId = req.user.id;

    if (!["up", "down"].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote value." });
    }

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found." });

    // Find existing vote by this user
    const existingVoteIndex = review.votes.findIndex(v => v.userId.toString() === userId);

    if (existingVoteIndex === -1) {
      // User hasn't voted yet, add vote
      review.votes.push({ userId, vote });
    } else {
      const prevVote = review.votes[existingVoteIndex].vote;
      if (prevVote === vote) {
        // User clicked same vote again, remove vote (toggle/cancel)
        review.votes.splice(existingVoteIndex, 1);
      } else {
        // User switched vote
        review.votes[existingVoteIndex].vote = vote;
      }
    }

    // Recalculate counts from votes array
    review.helpfulVotes = review.votes.filter(v => v.vote === "up").length;
    review.notHelpfulVotes = review.votes.filter(v => v.vote === "down").length;

    await review.save();
    res.json({ message: "Vote updated.", review });
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