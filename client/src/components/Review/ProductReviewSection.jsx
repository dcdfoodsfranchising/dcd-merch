import React, { useEffect, useState } from "react";
import { getProductReviews, voteReview } from "../../services/reviewService";
import ProductReviewList from "./ProductReviewList";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ProductReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starFilter, setStarFilter] = useState(0); // 0 = all, 5 = 5 stars, etc.
  const [showCount, setShowCount] = useState(3);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getProductReviews(productId)
      .then((data) => setReviews(data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleVote = async (reviewId, helpful) => {
    try {
      await voteReview(reviewId, helpful);
      // Refresh reviews after voting
      const updated = await getProductReviews(productId);
      setReviews(updated);
    } catch {}
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : "0.0";

  // Count per star
  const starCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  // Filter reviews by star
  const filteredReviews =
    starFilter > 0 ? reviews.filter((r) => r.rating === starFilter) : reviews;

  // Reviews to show (pagination)
  const visibleReviews = filteredReviews.slice(0, showCount);

  return (
    <section className="mt-10">
      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-6">Product Reviews</h3>
      {/* Average Rating & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 p-4 rounded-lg bg-slate-50 border border-slate-200">
        {/* Average Rating */}
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-yellow-500">{averageRating}</span>
          <div className="flex flex-col items-start">
            <div className="flex gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < Math.round(averageRating) ? "text-yellow-500 text-xl" : "text-gray-300 text-xl"}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-500 text-sm ml-0">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>
        {/* Star Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-3 py-1 rounded border text-sm ${
              starFilter === 0 ? "bg-red-600 text-white" : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => setStarFilter(0)}
          >
            All
          </button>
          {[5, 4, 3, 2, 1].map((star, idx) => (
            <button
              key={star}
              className={`px-3 py-1 rounded border text-sm flex items-center gap-1 ${
                starFilter === star ? "bg-red-600 text-white" : "bg-white text-gray-700 border-gray-300"
              }`}
              onClick={() => setStarFilter(star)}
            >
              {star} <span className="text-yellow-500">★</span>
              <span className="text-xs text-gray-500">({starCounts[idx]})</span>
            </button>
          ))}
        </div>
      </div>
      {/* Reviews List */}
      <div className="mb-6">
        <ProductReviewList reviews={visibleReviews} loading={loading} onVote={handleVote} />
      </div>
      {/* Load More */}
      {filteredReviews.length > showCount && (
        <div className="flex justify-center mt-4">
          <button
            className="flex items-center gap-2 text-red-600 hover:underline bg-transparent border-none shadow-none px-0 py-0 font-semibold text-base"
            style={{ background: "none" }}
            onClick={() => setShowCount((prev) => prev + 3)}
          >
            Load More <FaChevronDown />
          </button>
        </div>
      )}
      {/* Show Less */}
      {showCount > 3 && (
        <div className="flex justify-center mt-2">
          <button
            className="flex items-center gap-2 text-gray-600 hover:underline bg-transparent border-none shadow-none px-0 py-0 font-semibold text-base"
            style={{ background: "none" }}
            onClick={() => setShowCount(3)}
          >
            Show Less <FaChevronUp />
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductReviewSection;