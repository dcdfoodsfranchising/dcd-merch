import React from "react";

export default function ProductReviews({ reviews }) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Product Reviews</h3>
      <div className="mt-4 space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="border rounded p-4 shadow-sm">
              <p className="text-sm text-slate-900 font-medium">{review.user}</p>
              <p className="text-sm text-slate-500 mt-1">{review.comment}</p>
              <p className="text-sm text-yellow-500 mt-1">Rating: {review.rating} / 5</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No reviews available for this product.</p>
        )}
      </div>
    </div>
  );
}