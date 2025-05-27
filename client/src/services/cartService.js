import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Get cart items
export const getCartItems = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found.');

        const response = await axios.get(`${API_BASE_URL}/cart/get-cart`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error?.response?.data?.message || error.message);
        throw error;
    }
};

// Add item to cart
export const addToCart = async (productId, size, color, quantity) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${API_BASE_URL}/cart/add-to-cart`,
            { productId, size, color, quantity },
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
// Update cart quantity
export const updateCartQuantity = async (cartItem, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    const response = await axios.patch(
        `${API_BASE_URL}/cart/update-cart-quantity`,
        {
            productId: cartItem.productId._id,
            size: cartItem.variant.size,
            color: cartItem.variant.color,
            quantity
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.cart;
};

// Remove item from cart by productId
export const removeCartItem = async (productId, size, color) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");
    const response = await axios.patch(
        `${API_BASE_URL}/cart/${productId}/remove-from-cart`,
        { size, color },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Clear cart
export const clearCart = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
            `${API_BASE_URL}/cart/clear`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};
