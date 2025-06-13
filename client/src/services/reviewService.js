import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/reviews`;

// Helper to get auth headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Create a review (with images)
export const createReview = async (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((img) => formData.append("images", img));
    } else if (Array.isArray(value) && key !== "images") {
      // Tags and other arrays as JSON string
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  const res = await axios.post(API_URL, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get all reviews for a product
export const getProductReviews = async (productId) => {
  const res = await axios.get(`${API_URL}/${productId}`);
  return res.data;
};

// Vote helpful/not helpful
// Only sends vote ("up" or "down")
export const voteReview = async (reviewId, vote) => {
  const res = await axios.post(
    `${API_URL}/${reviewId}/vote`,
    { vote },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Reply to a review (admin/seller)
export const replyToReview = async (reviewId, comment) => {
  const res = await axios.post(
    `${API_URL}/${reviewId}/reply`,
    { comment },
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Edit a review (user)
export const editReview = async (reviewId, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((img) => formData.append("images", img));
    } else if (Array.isArray(value) && key !== "images") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  const res = await axios.put(`${API_URL}/${reviewId}`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete a review
export const deleteReview = async (reviewId) => {
  const res = await axios.delete(`${API_URL}/${reviewId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// Report a review
export const reportReview = async (reviewId) => {
  const res = await axios.post(
    `${API_URL}/${reviewId}/report`,
    {},
    { headers: getAuthHeaders() }
  );
  return res.data;
};

// Hide/unhide a review (admin)
export const setReviewHidden = async (reviewId, hidden) => {
  const res = await axios.patch(
    `${API_URL}/${reviewId}/hidden`,
    { hidden },
    { headers: getAuthHeaders() }
  );
  return res.data;
};