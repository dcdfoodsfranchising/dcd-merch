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
          order.items.forEach((item) => {
            if (item.productId === product._id) {
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
    <div
      onClick={handleClick}
      className="border rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition duration-200"
    >
      <img
        src={
          product.images?.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/150"
        }
        alt={product.name}
        className="w-full h-40 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <div className="flex justify-between items-center mt-1">
        <p className="text-gray-600 font-bold">{getLowestPrice()}</p>
        <p className="text-sm text-gray-500">{soldCount} sold</p>
      </div>
    </div>
  );
};

export default ProductCard;
