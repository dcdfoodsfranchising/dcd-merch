import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to get the token from localStorage (or sessionStorage)
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User is not authenticated');
    }
    return token;
};

// Add or update delivery details
export const saveDeliveryDetails = async (details) => {
    try {
        const token = getAuthToken(); // Retrieve the token automatically
        const response = await axios.post(
            `${API_BASE_URL}/details/delivery-details`,
            details,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Something went wrong' };
    }
};

// Get delivery details for logged-in user
export const getOwnDeliveryDetails = async () => {
    try {
        const token = getAuthToken(); // Retrieve the token automatically
        const response = await axios.get(
            `${API_BASE_URL}/details/delivery-details`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.deliveryDetails;
    } catch (error) {
        throw error.response?.data || { message: 'Something went wrong' };
    }
};

// Admin: Get delivery details by user ID
export const getDeliveryDetailsByAdmin = async (userId) => {
    try {
        const token = getAuthToken(); // Retrieve the token automatically
        const response = await axios.get(
            `${API_BASE_URL}/details/delivery-details/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.deliveryDetails;
    } catch (error) {
        throw error.response?.data || { message: 'Something went wrong' };
    }
};
