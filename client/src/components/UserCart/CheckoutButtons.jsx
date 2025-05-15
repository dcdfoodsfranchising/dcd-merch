import React from "react";

export default function CheckoutButtons({ loading, cartItems, onClear, onCheckout }) {
  return (
    <div className="flex justify-between">
      <button
        onClick={onClear}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-1/2 mr-2"
        disabled={loading}
      >
        Proceed to Clear Cart
      </button>
      <button
        onClick={onCheckout}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-1/2 ml-2"
        disabled={loading || cartItems.length === 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}