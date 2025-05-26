import React from "react";

const OrderCard = ({ order, handleCancelOrder }) => (
  <div className="bg-white rounded-xl shadow p-4 mb-6 border border-gray-200">
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
          <div className="text-xs text-gray-500">
            {item.color && <span>{item.color} </span>}
            {item.size && <span>{item.size}</span>}
          </div>
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

export default OrderCard;