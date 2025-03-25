import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { fetchAllOrders } from "../services/orderService";
import OrderTable from "../components/Order/OrderTable";
import moment from "moment"; // ✅ For date filtering

const socket = io(process.env.REACT_APP_API_BASE_URL); // ✅ Connect to WebSocket server

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("day"); // ✅ Default filter: Today
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD")); // ✅ Default: Today

  useEffect(() => {
    loadOrders();

    // ✅ Listen for real-time order updates
    socket.on("newOrder", (newOrder) => {
      console.log("📢 New Order Received:", newOrder);
      setOrders((prevOrders) => {
        const updatedOrders = [newOrder, ...prevOrders].sort((a, b) => new Date(b.orderedOn) - new Date(a.orderedOn));
        updatePendingCount(updatedOrders);
        return updatedOrders;
      });
    });

    return () => {
      socket.off("newOrder"); // Cleanup on unmount
    };
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

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
    setSelectedDate(moment().format("YYYY-MM-DD")); // Reset date to today when changing filter type
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filterOrdersByDate = (orders) => {
    const now = moment();
    return orders.filter(order => {
      const orderDate = moment(order.orderedOn);
      if (filterType === "day") {
        return orderDate.isSame(moment(selectedDate), "day");
      }
      if (filterType === "week") {
        return orderDate.isSame(now, "week");
      }
      if (filterType === "month") {
        return orderDate.isSame(now, "month");
      }
      return true; // Default: Show all
    });
  };

  const filteredOrders = filterOrdersByDate(activeTab === "All" ? orders : orders.filter(order => order.status === activeTab));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

      {/* Filter Bar */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          {/* Filter Type Dropdown */}
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="border p-2 rounded-md"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>

          {/* Date Picker (only visible when filtering by day) */}
          {filterType === "day" && (
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border p-2 rounded-md"
            />
          )}
        </div>
      </div>

      {/* Tabs for filtering orders */}
      <div className="flex space-x-4 mb-6 border-b">
        {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
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

      {/* Show Loading Indicator */}
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <OrderTable orders={filteredOrders} />
      )}
    </div>
  );
}
