import React from "react";
import { FaTruck, FaUndo, FaClock } from "react-icons/fa";

export default function Shipping() {
  return (
    <section className="w-full flex justify-center py-12 bg-gray-100">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 text-center px-4">
        {/* Free Delivery */}
        <div className="flex flex-col items-center p-6 md:p-10 bg-white rounded-2xl shadow-lg">
          <FaTruck className="text-4xl md:text-5xl text-red-700 mb-4" />
          <h3 className="font-extrabold text-xl md:text-2xl mb-3">Free Delivery</h3>
          <p className="text-gray-700 text-base md:text-lg">
            Enjoy free shipping on all orders over ₱2,500.
          </p>
        </div>
        {/* Refund Policy */}
        <div className="flex flex-col items-center p-6 md:p-10 bg-white rounded-2xl shadow-lg">
          <FaUndo className="text-4xl md:text-5xl text-red-700 mb-4" />
          <h3 className="font-extrabold text-xl md:text-2xl mb-3">Refund Policy</h3>
          <p className="text-gray-700 text-base md:text-lg">
            30-day hassle-free returns on all products.
          </p>
        </div>
        {/* ETA of Orders */}
        <div className="flex flex-col items-center p-6 md:p-10 bg-white rounded-2xl shadow-lg">
          <FaClock className="text-4xl md:text-5xl text-red-700 mb-4" />
          <h3 className="font-extrabold text-xl md:text-2xl mb-3">Order ETA</h3>
          <p className="text-gray-700 text-base md:text-lg">
            Most orders delivered within 3-7 business days.
          </p>
        </div>
      </div>
    </section>
  );
}