import React, { useState, useEffect } from "react";
import EditProduct from "../Product/EditProduct";
import { activateProduct } from "../../services/productService"; 

export default function AdminView({ productsData, fetchData }) {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  // State for error message
  const token = localStorage.getItem('token');

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
    setSelectedProductId(null); // Reset selected product
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleActivateProduct = async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMessage('No authentication token found. Please log in again.');
      return;  // Early return if no token is found
    }

    try {
      const result = await activateProduct(productId, token);
      console.log('Product activated successfully', result);
      fetchData();  // Optionally refresh data
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      console.error('Error activating product:', error);
      setErrorMessage('Failed to activate product. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h1>

      {/* Show error message if any */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
          {errorMessage}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Product Name</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Availability</th>
              <th className="p-3 border">Edit</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="text-center">
                  <td className="p-3 border">{product.name}</td>
                  <td className="p-3 border">₱{product.price.toFixed(2)}</td>
                  <td
                    className={`p-3 border ${product.isActive ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.isActive ? "Available" : "Unavailable"}
                  </td>
                  <td className="p-3 border">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEditClick(product._id)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="p-3 border">
                    {product.isActive ? (
                      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        Archive
                      </button>
                    ) : (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        onClick={() => handleActivateProduct(product._id)}
                      >
                        Activate
                      </button>
                    )}
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

      {/* Edit Product Modal */}
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
