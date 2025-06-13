import React, { useState } from "react";
import { FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown } from "react-icons/fa";
import { voteReview } from "../../services/reviewService";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const maskUsername = (username = "") => {
  if (username.length <= 2) return username;
  return (
    username[0] +
    "*".repeat(username.length - 2) +
    username[username.length - 1]
  );
};

const ProductReviewList = ({ reviews, loading, onVote }) => {
  const [voteLoading, setVoteLoading] = useState({});
  const [preview, setPreview] = useState({ images: null, index: 0 });

  const handleVoteClick = async (reviewId, type) => {
    if (voteLoading[reviewId]) return;
    setVoteLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      if (onVote) {
        await onVote(reviewId, type); // Pass the reviewId and type to onVote
      } else {
        await voteReview(reviewId, type);
      }
    } catch (e) {
      // Optionally show error
    }
    setVoteLoading((prev) => ({ ...prev, [reviewId]: false }));
  };

  const openPreview = (images, idx) => setPreview({ images, index: idx });
  const closePreview = () => setPreview({ images: null, index: 0 });
  const showPrev = () =>
    setPreview((prev) => ({
      ...prev,
      index: (prev.index - 1 + prev.images.length) % prev.images.length,
    }));
  const showNext = () =>
    setPreview((prev) => ({
      ...prev,
      index: (prev.index + 1) % prev.images.length,
    }));

  if (loading) {
    return <div>Loading reviews...</div>;
  }
  if (!reviews || reviews.length === 0) {
    return <div className="text-gray-500 text-sm">No reviews yet.</div>;
  }
  return (
    <div className="space-y-6">
      {/* Image Preview Modal with Gallery */}
      {preview.images && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={closePreview}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={preview.images[preview.index]}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] rounded shadow-lg"
            />
            <button
              className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-black font-bold shadow"
              onClick={closePreview}
            >
              ×
            </button>
            {preview.images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full px-3 py-1 text-black font-bold shadow"
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full px-3 py-1 text-black font-bold shadow"
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  aria-label="Next image"
                >
                  ›
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs bg-black bg-opacity-40 px-2 py-1 rounded">
                  {preview.index + 1} / {preview.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {reviews.map((review) => (
        <div key={review._id} className="border-b pb-5">
          {/* Username */}
          <div className="font-semibold text-slate-900">
            {review.isAnonymous
              ? review.userId?.username
                ? maskUsername(review.userId.username)
                : "Anonymous"
              : review.userId?.username || "Anonymous"}
          </div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1">
            {(() => {
              const fullStars = Math.floor(review.rating);
              const hasHalfStar = review.rating - fullStars >= 0.5;
              const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
              return (
                <>
                  {[...Array(fullStars)].map((_, i) => (
                    <span key={`full-${i}`} className="text-yellow-500">★</span>
                  ))}
                  {hasHalfStar && (
                    <span key="half" className="text-yellow-500">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="inline">
                        <defs>
                          <linearGradient id="half-grad">
                            <stop offset="50%" stopColor="currentColor" />
                            <stop offset="50%" stopColor="#d1d5db" />
                          </linearGradient>
                        </defs>
                        <polygon points="10,1 12.59,6.99 19,7.64 14,12.26 15.18,18.54 10,15.27 4.82,18.54 6,12.26 1,7.64 7.41,6.99" fill="url(#half-grad)" />
                      </svg>
                    </span>
                  )}
                  {[...Array(emptyStars)].map((_, i) => (
                    <span key={`empty-${i}`} className="text-gray-300">★</span>
                  ))}
                </>
              );
            })()}
          </div>
          {/* Date */}
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(review.createdAt)}
          </div>
          {/* Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.images.map((img, i) => {
                const baseUrl = process.env.REACT_APP_API_BASE_URL?.replace(/\/+$/, "");
                const imagePath = img.replace(/^\/+/, "");
                const imageUrl = img.startsWith("http")
                  ? img
                  : `${baseUrl}/${imagePath}`;
                return (
                  <img
                    key={i}
                    src={imageUrl}
                    alt="review"
                    className="w-20 h-20 object-cover rounded border cursor-pointer"
                    loading="lazy"
                    onClick={() =>
                      openPreview(
                        review.images.map(image => image.startsWith("http")
                          ? image
                          : `${baseUrl}/${image.replace(/^\/+/, "")}`),
                        i
                      )
                    }
                  />
                );
              })}
            </div>
          )}
          {/* Comment */}
          <div className="text-sm text-gray-700 mt-2">{review.comment}</div>
          {/* Tags */}
          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {review.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block bg-zinc-100 text-red-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Like/Dislike */}
          <div className="flex items-center gap-4 mt-2">
            <button
              className="flex items-center gap-1 px-2 py-1 rounded transition"
              onClick={() => handleVoteClick(review._id, "up")}
              title="Helpful"
              aria-pressed={review.userVote === "up"}
              disabled={voteLoading[review._id]}
            >
              {review.userVote === "up" ? (
                <FaThumbsUp className="fill-current text-red-600" />
              ) : (
                <FaRegThumbsUp className="fill-current text-red-600" />
              )}
              <span>{review.helpfulVotes || 0}</span>
            </button>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded transition"
              onClick={() => handleVoteClick(review._id, "down")}
              title="Not Helpful"
              aria-pressed={review.userVote === "down"}
              disabled={voteLoading[review._id]}
            >
              {review.userVote === "down" ? (
                <FaThumbsDown className="fill-current text-red-600" />
              ) : (
                <FaRegThumbsDown className="fill-current text-red-600" />
              )}
              <span>{review.notHelpfulVotes || 0}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductReviewList;