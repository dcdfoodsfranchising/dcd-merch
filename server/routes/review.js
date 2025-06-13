const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review");
const auth = require("../middlewares/auth");

// Use Cloudinary upload middleware
const upload = require("../middlewares/multer");

// Create review
router.post(
  "/",
  auth.verify,
  upload.array("images", 5),
  reviewController.createReview
);

// Get all reviews for a product
router.get("/:productId", reviewController.getProductReviews);

// Vote helpful/not helpful
router.post("/:reviewId/vote", auth.verify, reviewController.voteReview);

// Reply to a review (admin/seller)
router.post("/:reviewId/reply", auth.verify, auth.verifyAdmin, reviewController.replyToReview);

// Edit review (user)
router.put("/:reviewId", auth.verify, upload.array("images", 5), reviewController.editReview);

// Delete review (user or admin)
router.delete("/:reviewId", auth.verify, reviewController.deleteReview);

// Report review (user)
router.post("/:reviewId/report", auth.verify, reviewController.reportReview);

// Hide/unhide review (admin)
router.patch("/:reviewId/hidden", auth.verify, auth.verifyAdmin, reviewController.setReviewHidden);

module.exports = router;