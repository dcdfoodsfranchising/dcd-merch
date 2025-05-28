import React from "react";

const ratingLabels = {
  1: "Terrible",
  2: "Poor",
  3: "Average",
  4: "Good",
  5: "Amazing",
};

const ratingColors = {
  1: "text-yellow-400",
  2: "text-yellow-400",
  3: "text-yellow-400",
  4: "text-yellow-400",
  5: "text-yellow-400",
};

const StarRating = ({ value, onChange }) => (
  <div className="flex items-center gap-2 justify-between w-full">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <svg
            className={`w-7 h-7 ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.287-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
        </button>
      ))}
    </div>
    <span className={`ml-2 text-sm font-medium ${ratingColors[value] || "text-gray-400"}`}>
      {ratingLabels[value] || ""}
    </span>
  </div>
);

export default StarRating;