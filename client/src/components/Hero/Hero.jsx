import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleShopNow = () => {
    // Scroll to the products section by id
    const productsSection = document.getElementById("products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="relative w-full min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-hidden"
      style={{
        backgroundImage: "url('/assets/images/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-2xl md:max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg leading-tight">
          Welcome to DCD Merch
        </h1>
        <p className="text-base sm:text-lg md:text-2xl text-white mb-6 md:mb-8 drop-shadow">
          Discover exclusive products and the latest trends!
        </p>
        <div className="flex flex-row gap-2justify-center">
          <button
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow hover:bg-red-700 transition"
            style={{ minWidth: 0 }}
            onClick={handleShopNow}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}