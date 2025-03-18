import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to get active products
export const getActiveProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/active`);
    return response.data; // Assuming the response is an array of products
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
};

// Function to get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/all`);
    return response.data; // Assuming the response is an array of products
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

// Function to update product information
export const updateProductInfo = async (productId, productData) => {
  const token = localStorage.getItem('token');

  if (!token) {
      throw new Error('Authentication token is missing');
  }

  const response = await axios.patch(
      `${process.env.REACT_APP_API_BASE_URL}/products/${productId}/update`,
      productData,
      {
          headers: {
              Authorization: `Bearer ${token}` // Send the token in the Authorization header
          }
      }
  );

  return response.data;
};


export const getProductById = async (id) => {
  try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`); // Use 'id' here instead of 'productId'
      const product = await response.json();
      console.log("API response:", product); // Log API response
      return product;
  } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
  }
};


export const activateProduct = async (productId, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/products/${productId}/activate`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the authorization token
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error activating product:', error);
    throw error;
  }
};