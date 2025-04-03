import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const token = localStorage.getItem('token');
console.log('Token:', token);

// Get cart items
export const getCartItems = async () => {
    try {
        const token = localStorage.getItem('token'); // Get the auth token from localStorage
        const response = await axios.get(`${API_BASE_URL}/cart/get-cart`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

// Add item to cart
export const addToCart = async (productId, quantity) => {
    try {
        const token = localStorage.getItem('token'); // Get the auth token from localStorage
        const response = await axios.post(
            `${API_BASE_URL}/cart/add-to-cart`,
            { productId, quantity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw error;
    }
};

export const updateCartQuantity = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    console.log('Auth Token:', token);  // Verify token is being passed

    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.patch(
            `${API_BASE_URL}/cart/update-cart-quantity`,
            { productId, quantity },
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // Make sure token is included
                },
            }
        );

        console.log('Response from server:', response.data);
        return response.data.updatedCart;  // Return updated cart
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw new Error(error.response?.data?.message || 'Failed to update cart');
    }
};



// Remove item from cart
export const removeCartItem = async (productId) => {
    try {
        const token = localStorage.getItem('token'); // Get the auth token from localStorage
        const response = await axios.delete(`${API_BASE_URL}/cart/${productId}/remove-from-cart`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw error;
    }
};

// Clear cart
export const clearCart = async () => {
    try {
        const token = localStorage.getItem('token'); // Get the auth token from localStorage
        const response = await axios.delete(`${API_BASE_URL}/cart/clear`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};
