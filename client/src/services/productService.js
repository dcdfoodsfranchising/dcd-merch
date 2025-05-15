import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

//  Create a new product
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price", productData.price);
    formData.append("quantity", productData.quantity);

    // Append multiple images
    productData.images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await axios.post(
      `${API_BASE_URL}/products/`,
      formData, // ✅ Send as FormData instead of JSON
      {
        headers: {
          "Content-Type": "multipart/form-data", // ✅ Important for file uploads
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.product;
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
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`);
    const data = await response.json(); // ✅ Define `data` here
    return data.product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
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

  export const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure auth token is included
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
  
      return await response.json(); // Return API response
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };
  

  // Upload Product Images
export const uploadProductImages = async (productId, files) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });

    const response = await axios.post(
      `${API_BASE_URL}/products/${productId}/upload-images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading product images:", error);
    throw error;
  }
};

// Delete Product Image
export const deleteProductImage = async (productId, imageUrl) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.delete(
      `${API_BASE_URL}/products/${productId}/delete-image`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { imageUrl }, // Send imageUrl in request body
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting product image:", error);
    throw error;
  }
};


export const updateProductQuantity = async (productId, { size, color, quantityChange }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.patch(
      `${API_BASE_URL}/products/${productId}/update-quantity`,
      { size, color, quantityChange },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating product quantity:", error);
    throw error;
  }
};