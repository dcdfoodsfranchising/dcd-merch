import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//  Create a new product
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.post(
      `${API_BASE_URL}/products/`,
      productData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Ensure only admins can create products
        },
      }
    );

    return response.data.product; // ✅ Return the created product
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

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
    const token = localStorage.getItem("token"); // ✅ Get token from localStorage

    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.get(`${API_BASE_URL}/products/all`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Include token in request headers
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
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


export const activateProduct = async (productId, token = localStorage.getItem("token")) => {
  try {
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await axios.patch(
      `${API_BASE_URL}/products/${productId}/activate`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Ensure token is included
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error activating product:", error);
    throw error;
  }
};

// Function to archive (deactivate) a product
export const archiveProduct = async (productId, token = localStorage.getItem("token")) => {
    try {
      if (!token) {
        throw new Error("No authentication token found.");
      }
  
      const response = await axios.patch(
        `${API_BASE_URL}/products/${productId}/archive`, // ✅ API route for archiving
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Send token for authentication
          },
        }
      );
  
      return response.data; // ✅ Return the archived product data
    } catch (error) {
      console.error("Error archiving product:", error);
      throw error;
    }
  };