import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Set up the Authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get user details
export const getUserDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/details`, getAuthHeaders());
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error.response?.data || error.message;
  }
};

// Update username
export const updateUsername = async (username) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/users/update-username`,
      { username },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating username:", error);
    throw error.response?.data || error.message;
  }
};

// Update password
export const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/update-password`,
        { currentPassword, newPassword },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error.response?.data || error.message;
    }
  };
  
  // Upload profile picture
  export const uploadProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axios.post(
        `${API_BASE_URL}/users/upload-profile-picture`,
        formData,
        {
          headers: {
            ...getAuthHeaders().headers, // Include authorization headers
            "Content-Type": "multipart/form-data", // Ensure the correct content type
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error.response?.data || error.message;
    }
  };