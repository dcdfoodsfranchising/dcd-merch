import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${product._id}`); // or product.id, depending on your schema
  };

  return (
    <div 
      onClick={handleClick}
      className="border rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition duration-200"
    >
      <img
        src={product.images?.length > 0 ? product.images[0] : "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600 font-bold">₱{product.price}</p>
      <button className="mt-2 text-blue-500" onClick={(e) => e.stopPropagation()}>
        <img src="/assets/icons/cart.svg" className="w-10" alt="Add to cart" />
      </button>
    </div>
  );
};

export default ProductCard;
