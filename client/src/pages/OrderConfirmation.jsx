import React, { useEffect, useState } from "react";
import { getUserOrders } from "../services/orderService";

const OrderConfirmation = () => {
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getUserOrders();
        if (orders && orders.length > 0) {
          setLatestOrder(orders[orders.length - 1]);
        }
      } catch (error) {
        // Handle error if needed
      }
    };
    fetchOrders();
  }, []);

  if (!latestOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500 text-lg">Loading order details...</div>
      </div>
    );
  }

  // Format date to show "May 22, 2025"
  const orderDate = latestOrder.orderedOn
    ? new Date(latestOrder.orderedOn).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xl">
        <div className="bg-red-700 px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-white">Order Confirmation</h2>
            <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {latestOrder.status}
            </span>
          </div>
          <p className="text-slate-200 text-sm mt-2">Thank you for your order!</p>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-slate-500 text-sm font-medium">Order Number</p>
              <p className="text-slate-900 text-sm font-medium mt-2">
                {latestOrder._id}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Date</p>
              <p className="text-slate-900 text-sm font-medium mt-2">
                {orderDate}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Total</p>
              <p className="text-sm font-medium text-red-700 mt-2">
                ₱{Number(latestOrder.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 mt-8">
            <h3 className="text-base font-medium text-slate-900 mb-6">Shipping Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-sm font-medium">Customer</p>
                <p className="text-slate-900 text-sm font-medium mt-2">
                  {latestOrder.deliveryDetails?.firstName} {latestOrder.deliveryDetails?.lastName}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Shipping Method</p>
                <p className="text-slate-900 text-sm font-medium mt-2">Standard Delivery</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Address</p>
                <p className="text-slate-900 text-sm font-medium mt-2">
                  {latestOrder.deliveryDetails?.completeAddress}
                  {latestOrder.deliveryDetails?.barangay && latestOrder.deliveryDetails?.city
                    ? `, ${latestOrder.deliveryDetails.barangay}, ${latestOrder.deliveryDetails.city}`
                    : latestOrder.deliveryDetails?.barangay
                    ? `, ${latestOrder.deliveryDetails.barangay}`
                    : latestOrder.deliveryDetails?.city
                    ? `, ${latestOrder.deliveryDetails.city}`
                    : ""}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Phone</p>
                <p className="text-slate-900 text-sm font-medium mt-2">
                  {latestOrder.deliveryDetails?.contactNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-base font-medium text-slate-900 mb-6">
              Order Items ({latestOrder.productsOrdered.length})
            </h3>
            <div className="space-y-4">
              {latestOrder.productsOrdered.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 max-sm:flex-col ${
                    idx !== 0 ? "max-sm:border-t max-sm:pt-4 max-sm:border-gray-300" : ""
                  }`}
                >
                  {/* Product Image */}
                  {Array.isArray(item.images) && item.images[0] && (
                    <div className="w-[70px] h-[70px] bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name || "Product"}
                        className="w-14 h-14 object-contain rounded-sm"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-slate-500 text-xs font-medium mt-2">
                      {/* Add variant/color if available */}
                    </p>
                    <p className="text-slate-500 text-xs font-medium mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-900 text-sm font-semibold">
                      ₱{Number(item.subtotal ?? item.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 mt-8">
            <h3 className="text-base font-medium text-slate-900 mb-6">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 font-medium">Subtotal</p>
                <p className="text-slate-900 text-sm font-semibold">
                  ₱{Number(latestOrder.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 font-medium">Shipping</p>
                <p className="text-slate-900 text-sm font-semibold">₱0.00</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 font-medium">Tax</p>
                <p className="text-slate-900 text-sm font-semibold">₱0.00</p>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-300">
                <p className="text-[15px] font-semibold text-slate-900">Total</p>
                <p className="text-[15px] font-semibold text-red-700">
                  ₱{Number(latestOrder.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">
              Need help?{" "}
              <a href="#" className="text-red-700 hover:underline">
                Contact us
              </a>
            </p>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-medium text-[15px] py-2 px-4 rounded-lg max-sm:-order-1 cursor-pointer transition duration-200"
              onClick={() => window.location.href = "/"}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;