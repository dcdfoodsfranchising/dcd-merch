import React, { useEffect, useState } from "react";
import { getUserOrders, cancelOrder } from "../services/orderService";
import { addToCart } from "../services/cartService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // <-- Add this import
import ReviewModal from "../components/Review/ReviewModal";
import { createReview } from "../services/reviewService";

const TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const navigate = useNavigate();

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

  // Helper to filter orders by tab
  const filterOrdersByTab = (orders, tab) => {
    if (tab === "all") return orders;
    if (tab === "cancelled")
      return orders.filter((order) => order.status?.toLowerCase() === "cancelled");
    return orders.filter((order) => order.status?.toLowerCase() === tab);
  };

  // Render order card (for all tabs)
  const renderOrderCard = (order) => (
    <div
      key={order._id}
      className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-200"
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "Cancelled"
              ? "bg-gray-200 text-gray-500"
              : order.status === "Processing"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.status}
        </span>
        <span className="text-sm text-black">
          {new Date(order.orderedOn).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      {order.productsOrdered.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 py-3 border-b last:border-b-0 border-gray-100"
        >
          <img
            src={item.images?.[0] || "/placeholder.png"}
            alt={item.name}
            className="w-12 h-12 object-contain rounded bg-gray-100"
          />
          <div className="flex-1">
            <div className="font-medium text-black">{item.name}</div>
            {/* Removed color and size display here */}
            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
          </div>
          <div className="text-sm font-semibold text-black min-w-[80px] text-right">
            ₱
            {Number(item.subtotal / item.quantity).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="text-sm text-black font-semibold">Order Total</span>
        <span className="text-base font-bold text-black">
          ₱{Number(order.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
      {(order.status?.toLowerCase() === "pending" || order.status?.toLowerCase() === "processing") && (
        <div className="flex justify-end mt-4">
          <button
            className="min-w-[110px] py-2 px-4 rounded-lg border border-red-600 text-red-600 bg-white text-sm font-semibold shadow-sm transition hover:bg-red-50"
            onClick={() => handleCancelOrder(order._id)}
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );

  // Render delivered product as a separate card with Rate and Buy Again buttons
  const renderDeliveredProductCard = (order, item, idx) => (
    <div
      key={order._id + "_" + idx}
      className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-200"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Delivered
        </span>
        <span className="text-sm text-black">
          {new Date(order.orderedOn).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="flex items-center gap-3 py-3">
        <img
          src={item.images?.[0] || "/placeholder.png"}
          alt={item.name}
          className="w-12 h-12 object-contain rounded bg-gray-100"
        />
        <div className="flex-1">
          <div className="font-medium text-black">{item.name}</div>
          {/* Removed color and size display */}
          <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
        </div>
        <div className="text-sm font-semibold text-black min-w-[80px] text-right">
          ₱{Number(item.subtotal / item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <span className="text-sm text-black font-semibold">Order Total</span>
        <span className="text-base font-bold text-black">
          ₱{Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <button
          className="min-w-[110px] py-2 px-4 rounded-lg border border-red-600 text-red-600 bg-white text-sm font-semibold shadow-sm transition hover:bg-red-50"
          onClick={() => handleRate(item.productId, order._id)}
        >
          Rate
        </button>
        <button
          className="min-w-[110px] py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-sm transition"
          onClick={() => handleBuyAgain(item)}
        >
          Buy Again
        </button>
      </div>
    </div>
  );

  const handleRate = (productId, orderId) => {
    setReviewProduct(productId);
    setReviewOrderId(orderId);
    setReviewModalOpen(true);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      const data = await getUserOrders();
      setOrders(data || []);
      toast.success("Order cancelled."); // <-- Use toast
    } catch (error) {
      toast.error("Failed to cancel order."); // <-- Use toast
    }
  };

  const handleBuyAgain = (item) => {
    const productId = item.productId?._id || item.productId;
    navigate(`/product/${productId}`);
  };

  const handleOpenReviewModal = (item) => {
    setReviewProduct(item);
    setReviewOrderId(item.orderId);
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewProduct(null);
    setReviewOrderId(null);
    setReviewModalOpen(false);
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      await createReview(reviewData);
      toast.success("Review submitted!");
      setReviewModalOpen(false);
    } catch (error) {
      toast.error("Failed to submit review.");
    }
  };

  // Orders to display in the current tab, most recent first
  // Custom sort: Delivered > Pending > Processing > Cancelled, recent first in each group
  const statusPriority = {
    delivered: 1,
    pending: 2,
    processing: 3,
    cancelled: 4,
  };

  const filteredOrders = filterOrdersByTab(orders, activeTab).sort((a, b) => {
    if (activeTab === "all") {
      // Sort by status priority, then by most recent
      const aPriority = statusPriority[a.status?.toLowerCase()] || 99;
      const bPriority = statusPriority[b.status?.toLowerCase()] || 99;
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      return new Date(b.orderedOn) - new Date(a.orderedOn);
    }
    // For other tabs, just sort by most recent
    return new Date(b.orderedOn) - new Date(a.orderedOn);
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-black">My Orders</h2>
      <div className="flex gap-0 mb-6 border-b border-gray-200 bg-white rounded-t-lg overflow-hidden">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={`flex-1 px-4 py-2 text-sm font-semibold transition border-none bg-transparent relative
              ${activeTab === tab.value ? "text-red-600" : "text-black"}
              `}
            style={{
              borderBottom: activeTab === tab.value ? "3px solid #dc2626" : "3px solid transparent",
              background: "none",
              outline: "none",
            }}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <div className="text-gray-400 text-sm">No orders found.</div>
          ) : (
            filteredOrders.flatMap((order) => {
              if (order.status?.toLowerCase() === "delivered") {
                // Render each delivered product as a separate card
                return order.productsOrdered.map((item, idx) =>
                  renderDeliveredProductCard(order, item, idx)
                );
              }
              // For other statuses, render the whole order as one card
              return renderOrderCard(order);
            })
          )}
        </>
      )}
      {reviewModalOpen && reviewProduct && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSubmit={handleReviewSubmit}
          product={reviewProduct}
          orderId={reviewOrderId}
        />
      )}
    </div>
  );
};

export default Order;