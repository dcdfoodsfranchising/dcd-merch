import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create a new product (with variants and images)
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description);

    // If variants is an array, append as JSON string
    if (Array.isArray(productData.variants)) {
      formData.append("variants", JSON.stringify(productData.variants));
    }

    // Append images
    if (Array.isArray(productData.images)) {
      productData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await axios.post(
      `${API_BASE_URL}/products/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
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

// Get all active products (public)
export const getActiveProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/active`);
    return response.data;
  } catch (error) {
    console.error("Error fetching active products:", error);
    return [];
  }
};

// Get all products (admin)
export const getAllProducts = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.get(`${API_BASE_URL}/products/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

// Update product info
export const updateProductInfo = async (productId, productData) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token is missing');

  const response = await axios.patch(
    `${API_BASE_URL}/products/${productId}/update`,
    productData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data.product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Activate a product
export const activateProduct = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.patch(
      `${API_BASE_URL}/products/${productId}/activate`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error activating product:", error);
    throw error;
  }
};

// Archive (deactivate) a product
export const archiveProduct = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.patch(
      `${API_BASE_URL}/products/${productId}/archive`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error archiving product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await axios.delete(
      `${API_BASE_URL}/products/${productId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Upload product images
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

// Delete product image
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
        data: { imageUrl },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting product image:", error);
    throw error;
  }
};

// Update product variant quantity
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