import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function OrderTable({ orders = [], onUpdateStatus }) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "Pending"); // Set initial status as the current status or "Pending"
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleStatusChange = () => {
    if (selectedOrder && newStatus) {
      onUpdateStatus(selectedOrder._id, newStatus); // Update the order status
      handleCloseModal(); // Close the modal after updating status
    }
  };

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
                  <td className="p-4">{new Date(order.orderedOn).toLocaleString()}</td>
                  <td className="p-4">{order.user?.name || "Unknown"}</td>
                  <td className="p-4">{order.user?.address?.street || "No Address"}</td>
                  <td className="p-4">₱{order.totalPrice?.toFixed(2) || "0.00"}</td>
                  <td
                    className={`p-4 font-bold ${
                      order.status === "Pending"
                        ? "text-yellow-500"
                        : order.status === "Shipped"
                        ? "text-blue-500"
                        : order.status === "Delivered"
                        ? "text-green-500"
                        : order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    {order.status || "Unknown"}
                  </td>
                  <td className="p-4 text-center relative">
                    {/* Three Dots Button */}
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => handleOpenModal(order)} // Open modal for this order
                    >
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

      {/* Modal for changing order status */}
      {openModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Change Status for Order {selectedOrder._id}</h3>
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700">Select Status:</label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border p-2 rounded-md"
              >
                {["Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
