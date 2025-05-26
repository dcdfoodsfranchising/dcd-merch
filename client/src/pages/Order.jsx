import React, { useEffect, useState } from "react";
import { getUserOrders } from "../services/orderService"; // Adjust the import path as needed

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data || []);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Separate active and history orders
  const activeOrders = orders.filter(
    (order) => order.status !== "Delivered" && order.status !== "Cancelled"
  );
  const historyOrders = orders.filter(
    (order) => order.status === "Delivered" || order.status === "Cancelled"
  );

  const renderOrderCard = (order) => (
    <div
      key={order._id}
      className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="text-xs text-gray-400">Order No.</span>
          <div className="font-semibold text-black">{order._id}</div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "Cancelled"
              ? "bg-gray-200 text-gray-500"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.status}
        </span>
      </div>
      <div className="text-sm text-black mb-2">
        {new Date(order.orderedOn).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {order.productsOrdered.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {Array.isArray(item.images) && item.images[0] && (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-10 h-10 object-contain rounded"
              />
            )}
            <span className="text-xs text-black">{item.name}</span>
            <span className="text-xs text-gray-500">x{item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-black">Total</span>
        <span className="text-base font-semibold text-black">
          ₱{Number(order.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-black">My Orders</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-black mb-4">Active Orders</h3>
            {activeOrders.length === 0 ? (
              <div className="text-gray-400 text-sm">No active orders.</div>
            ) : (
              activeOrders.map(renderOrderCard)
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Order History</h3>
            {historyOrders.length === 0 ? (
              <div className="text-gray-400 text-sm">No order history.</div>
            ) : (
              historyOrders.map(renderOrderCard)
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Order;