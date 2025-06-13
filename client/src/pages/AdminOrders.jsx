import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { fetchAllOrders, updateOrderStatus } from "../services/orderService";
import OrderTable from "../components/Order/OrderTable";

const socket = io(process.env.REACT_APP_API_BASE_URL);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    socket.on("newOrder", (newOrder) => {
      setOrders((prevOrders) => {
        const updatedOrders = [newOrder, ...prevOrders].sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn));
        updatePendingCount(updatedOrders);
        return updatedOrders;
      });
    });

    return () => {
      socket.off("newOrder");
    };
    // eslint-disable-next-line
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      if (data && data.orders) {
        const sortedOrders = data.orders.sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn));
        setOrders(sortedOrders);
        updatePendingCount(sortedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
    setLoading(false);
  };

  const updatePendingCount = (allOrders) => {
    const pendingOrders = (allOrders || []).filter(order => order.status === "Pending");
    setPendingCount(pendingOrders.length);
  };

  const filteredOrders = activeTab === "All"
    ? orders
    : orders.filter(order => order.status === activeTab);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
    } catch (error) {
      console.error("❌ Failed to update order:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

      {/* Tabs for filtering orders */}
      <div className="flex space-x-4 mb-6 border-b">
        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 ${
              activeTab === status ? "border-b-2 border-red-500 font-bold" : "text-gray-600"
            }`}
            onClick={() => setActiveTab(status)}
          >
            {status}
            {status === "Pending" && pendingCount > 0 && (
              <span className="ml-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table Container (responsive, scrollable) */}
      <div className="overflow-x-auto p-6 z-[10]">
        <div className=" overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-pulse w-full">
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded mb-2 w-5/6 mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded mb-2 w-2/3 mx-auto"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto"></div>
              </div>
            </div>
          ) : (
            <OrderTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
          )}
        </div>
      </div>
    </div>
  );
}
