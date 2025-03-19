import React, { useState, useEffect } from "react";
import { FiEdit, FiEye, FiEyeOff, FiStar } from "react-icons/fi";
import EditProduct from "../Product/EditProduct";
import { activateProduct, toggleFeatured } from "../../services/productService";

export default function AdminView({ productsData, fetchData }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (productsData && Array.isArray(productsData)) {
      setProducts(productsData);
    }
  }, [productsData]);

  const handleEditClick = (productId) => {
    setSelectedProductId(productId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProductId(null);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleActivateProduct = async (productId) => {
    try {
      await activateProduct(productId);
      fetchData();
      setErrorMessage("");
    } catch (error) {
      console.error("Error activating product:", error);
      setErrorMessage("Failed to activate product.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      {errorMessage && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      <div className="relative">
        {/* Table Wrapper with Scrollbar */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <table className="table-auto w-full border-collapse border border-gray-200 min-w-max">
            <thead>
              <tr className="bg-gray-500 text-white">
                <th className="p-3 border w-1/4">Product Name</th>
                <th className="p-3 border w-1/6">Price</th>
                <th className="p-3 border w-20">QTY</th>
                <th className="p-3 border w-1/6">Status</th>
                <th className="p-3 border w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="text-center">
                    <td className="p-3 border">{product.name}</td>
                    <td className="p-3 border">₱{product.price.toFixed(2)}</td>
                    <td className="p-3 border">{product.quantity}</td>
                    <td
                      className={`p-3 border ${
                        product.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.isActive ? "Available" : "Unavailable"}
                    </td>
                    <td className="p-3 border w-32">
                      <div className="flex justify-center space-x-3">
                        {/* Edit Button */}
                        <button
                          className="group relative text-black hover:text-blue-500 transition"
                          onClick={() => handleEditClick(product._id)}
                        >
                          <FiEdit size={24} />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-sm px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition">
                            Edit
                          </span>
                        </button>

                        {/* Activate/Deactivate Button */}
                        <button
                          className="group relative text-black hover:text-red-500 transition"
                          onClick={() => handleActivateProduct(product._id)}
                        >
                          {product.isActive ? <FiEyeOff size={24} /> : <FiEye size={24} />}
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-sm px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition">
                            {product.isActive ? "Deactivate" : "Activate"}
                          </span>
                        </button>

                        {/* Featured Toggle Button */}
                        <button
                          className={`group relative ${
                            product.isFeatured ? "text-yellow-500" : "text-black"
                          } hover:text-yellow-400 transition`}
                        >
                          <FiStar size={24} />
                          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-sm px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition">
                            {product.isFeatured ? "Unfeature" : "Feature"}
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isEditModalOpen && (
        <EditProduct
          productId={selectedProductId}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
}
