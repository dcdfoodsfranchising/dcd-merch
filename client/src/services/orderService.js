import axios from "axios";

// Set up the base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Fetch all orders (Admin)
 */
export const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data || { orders: [] }; // ✅ Ensure orders array always exists
    } catch (error) {
      console.error("Error fetching orders:", error);
      return { orders: [] }; // ✅ Prevent crashes by returning an empty array
    }
  };

/**
 * Fetch user-specific orders
 */
export const getUserOrders = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data.orders; // Return orders array
    } catch (error) {
        console.error("Error fetching user orders:", error);
        throw error.response ? error.response.data : new Error("Failed to fetch user orders");
    }
};

/**
 * Create a new order from the cart
 */
export const createOrder = async (deliveryDetails) => {
  console.log("Delivery details sent to /orders/checkout:", deliveryDetails);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/orders/checkout`,
      { deliveryDetails },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error.response ? error.response.data : new Error("Failed to create order");
  }
};

export const createDirectOrder = async ({
    productId,
    color,
    size,
    quantity,
    deliveryDetails
}) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/orders/buy-now`,
            {
                productId,
                color,
                size,
                quantity,
                deliveryDetails
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return response.data; // Return created order
    } catch (error) {
        console.error("Error creating direct order:", error);
        throw error.response ? error.response.data : new Error("Failed to create direct order");
    }
};

/**
 * Update order status (Admin)
 * @param {string} orderId - The ID of the order to update.
 * @param {string} newStatus - The new status of the order.
 */
export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/orders/update-status`, 
            { orderId, status: newStatus },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );
        return response.data; // Return updated order
    } catch (error) {
        console.error("Error updating order status:", error);
        throw error.response ? error.response.data : new Error("Failed to update order status");
    }
};

/**
 * Cancel an order (User)
 * @param {string} orderId - The ID of the order to cancel.
 */
export const cancelOrder = async (orderId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/orders/${orderId}/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data; // Return canceled order
    } catch (error) {
        console.error("Error canceling order:", error);
        throw error.response ? error.response.data : new Error("Failed to cancel order");
    }
};
