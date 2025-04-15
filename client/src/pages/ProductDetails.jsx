import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService"; // adjust the path

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then(setProduct).catch(console.error);
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <img
        src={product.images?.[0] || "https://via.placeholder.com/300"}
        alt={product.name}
        className="w-full max-w-md mx-auto"
      />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-xl font-bold mt-2">₱{product.price}</p>
    </div>
  );
};

export default ProductDetails;
