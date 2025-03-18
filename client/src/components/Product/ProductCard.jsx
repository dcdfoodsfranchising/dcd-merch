import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600 font-bold">₱{product.price}</p>
      <button className="mt-2 text-blue-500">
        <img src="/assets/icons/cart.svg" className="w-10" alt="" />
      </button>
    </div>
  );
};

export default ProductCard;
