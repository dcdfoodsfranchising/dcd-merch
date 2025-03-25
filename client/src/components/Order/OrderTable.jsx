import React from "react";
import { FiMoreVertical } from "react-icons/fi"; // Three dots icon for actions

export default function OrderTable({ orders = [] }) {
  return (
    <div className="relative overflow-x-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Date & Time</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={order._id} className={`text-left ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <td className="p-4">{order._id || "N/A"}</td>
                  <td className="p-4">
                    {order.orderedOn
                      ? new Date(order.orderedOn).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true
                        })
                      : "N/A"}
                  </td>
                  <td className="p-4">{order.user?.name || "Unknown"}</td>
                  <td className="p-4">
                    {order.user?.address
                      ? `${order.user.address.street}, ${order.user.address.city}, ${order.user.address.province}`
                      : "No Address"}
                  </td>
                  <td className="p-4">₱{order.totalPrice?.toFixed(2) || "0.00"}</td>
                  <td
                    className={`p-4 font-bold ${
                      order.status === "Pending"
                        ? "text-yellow-500"
                        : order.status === "Completed"
                        ? "text-green-500"
                        : order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    {order.status || "Unknown"}
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-gray-600 hover:text-gray-900">
                      <FiMoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
