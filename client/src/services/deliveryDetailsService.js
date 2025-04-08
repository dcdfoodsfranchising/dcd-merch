import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Add or update delivery details
export const saveDeliveryDetails = async (details, token) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/delivery-details`,
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
export const getOwnDeliveryDetails = async (token) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/delivery-details`,
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
export const getDeliveryDetailsByAdmin = async (userId, token) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/delivery-details/${userId}`,
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
