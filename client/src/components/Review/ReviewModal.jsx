import React, { useState, useRef } from "react";
import StarRating from "./StarRating";

const TAG_OPTIONS = [
  "Good quality",
  "Fast shipping",
  "Well packaged",
  "As described",
  "Would buy again",
];

const ReviewModal = ({ open, onClose, onSubmit, product, orderId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      productId: product._id || product,
      orderId,
      rating,
      comment,
      images,
      isAnonymous,
      tags: selectedTags,
    });
  };

  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-black text-3xl"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4">Rate Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Rating</label>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Comment</label>
            <textarea
              className="w-full border rounded px-2 py-1"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="button"
              onClick={handleAddPhotoClick}
              className="flex items-center gap-2 px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              <span
                role="img"
                aria-label="Add Photo"
                className="inline-block w-5 h-5 align-middle"
              >
                📷
              </span>
              Add Photo
            </button>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            {images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(images).map((file, idx) => (
                  <span key={idx} className="text-xs text-gray-500">
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="block mb-1 font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white text-gray-700 border-gray-300"
                  } transition`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              id="anon"
            />
            <label htmlFor="anon" className="text-sm">
              Post as anonymous
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;