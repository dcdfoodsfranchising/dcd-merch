import React, { useState } from "react";
import { FaThumbsUp, FaRegThumbsDown, FaThumbsDown } from "react-icons/fa";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Mask username: keep first and last letter, mask middle with *
const maskUsername = (username = "") => {
  if (username.length <= 2) return username;
  return (
    username[0] +
    "*".repeat(username.length - 2) +
    username[username.length - 1]
  );
};

// Get vote state from localStorage: "up", "down", or null
const getVote = (reviewId) => {
  return localStorage.getItem(`review_vote_${reviewId}`); // "up", "down", or null
};

const ProductReviewList = ({ reviews, loading, onVote }) => {
  // Local state to force re-render on vote change
  const [, setForce] = useState(0);

  const handleVoteClick = (reviewId, type) => {
    const currentVote = getVote(reviewId);
    if (currentVote === type) {
      // Remove vote
      localStorage.removeItem(`review_vote_${reviewId}`);
      if (onVote) onVote(reviewId, null); // null means remove vote
    } else {
      // Set new vote
      localStorage.setItem(`review_vote_${reviewId}`, type);
      if (onVote) onVote(reviewId, type === "up");
    }
    setForce((f) => f + 1); // force re-render
  };

  if (loading) {
    return <div>Loading reviews...</div>;
  }
  if (!reviews || reviews.length === 0) {
    return <div className="text-gray-500 text-sm">No reviews yet.</div>;
  }
  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const vote = getVote(review._id); // "up", "down", or null
        return (
          <div key={review._id} className="border-b pb-5">
            {/* Username */}
            <div className="font-semibold text-slate-900">
              {review.userId?.username
                ? maskUsername(review.userId.username)
                : "Anonymous"}
            </div>
            {/* Star Rating */}
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < review.rating ? "text-yellow-500" : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            {/* Date */}
            <div className="text-xs text-gray-500 mt-1">
              {formatDate(review.createdAt)}
            </div>
            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="review"
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
            {/* Comment */}
            <div className="text-sm text-gray-700 mt-2">{review.comment}</div>
            {/* Like/Dislike */}
            <div className="flex items-center gap-4 mt-2">
              <button
                className={`flex items-center gap-1 ${
                  vote === "up"
                    ? "text-red-700 font-bold"
                    : "text-red-600 hover:text-red-700"
                }`}
                onClick={() => handleVoteClick(review._id, "up")}
                title="Helpful"
              >
                <FaThumbsUp className="fill-current" />
                <span>{review.helpfulVotes || 0}</span>
              </button>
              <button
                className={`flex items-center gap-1 ${
                  vote === "down"
                    ? "text-red-700 font-bold"
                    : "text-red-600 hover:text-red-700"
                }`}
                onClick={() => handleVoteClick(review._id, "down")}
                title="Not Helpful"
              >
                {vote === "down" ? (
                  <FaThumbsDown className="fill-current" />
                ) : (
                  <FaRegThumbsDown className="fill-current" />
                )}
                <span>{review.notHelpfulVotes || 0}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductReviewList;