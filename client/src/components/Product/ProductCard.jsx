import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [soldCount, setSoldCount] = useState(0);

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const getLowestPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map((v) => v.price);
      return `₱${Math.min(...prices)}`;
    }
    return `₱${product.price}`;
  };

  // Fetch all orders and count how many of this product were sold
  useEffect(() => {
    const fetchSoldCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const allOrders = response.data.orders || [];
        let count = 0;

        allOrders.forEach((order) => {
          (order.items || order.productsOrdered || []).forEach((item) => {
            // Support both string and object for productId
            const id =
              typeof item.productId === "object"
                ? item.productId._id
                : item.productId;
            if (id === product._id) {
              count += item.quantity;
            }
          });
        });

        setSoldCount(count);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchSoldCount();
  }, [product._id]);

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        className="relative w-full aspect-[4/5] overflow-hidden shadow-md cursor-pointer group"
        style={{ minHeight: 0 }}
      >
        <img
          src={
            product.images?.length > 0
              ? product.images[0]
              : "https://via.placeholder.com/300x375?text=No+Image"
          }
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {/* Optional overlay for hover effect */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition duration-200" />
      </div>
      <div className="pt-2 px-1">
        <h2 className="text-sm font-semibold text-slate-900 truncate">
          {product.name}
        </h2>
        <div className="flex justify-between items-center mt-1">
          <p className="text-red-600 font-bold text-sm">{getLowestPrice()}</p>
          <p className="text-xs text-gray-500">{soldCount} sold</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
