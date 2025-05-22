import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { FiEdit } from "react-icons/fi";
import EditProduct from "../components/AdminProduct/EditProduct";
import CreateProduct from "../components/AdminProduct/CreateProduct";
import { activateProduct, archiveProduct, getAllProducts } from "../services/productService";

const socket = io(process.env.REACT_APP_API_BASE_URL);

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Failed to load products.");
      }
    }
    fetchProducts();

    socket.on("productUpdated", (updatedProduct) => {
      console.log("📢 Product Updated in Real-Time:", updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
    });

    return () => {
      socket.off("productUpdated");
    };
  }, []);

  const handleEditClick = (productId) => {
    setSelectedProductId(productId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProductId(null);
  };

  const handleProductUpdated = async () => {
    try {
      const updatedProducts = await getAllProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error updating product list:", error);
    }
  };

  const handleToggleProduct = async (productId, isActive) => {
    try {
      if (isActive) {
        await activateProduct(productId);
      } else {
        await archiveProduct(productId);
      }
      setProducts(await getAllProducts());
      setErrorMessage("");
    } catch (error) {
      console.error("Error toggling product status:", error);
      setErrorMessage("Failed to update product status.");
    }
  };

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleProductAdded = (newProduct) => setProducts([...products, newProduct]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-600 transition"
        >
          <h1 className="text-3xl">+</h1>
        </button>
      </div>

      {errorMessage && (
        <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">{errorMessage}</div>
      )}

      <div className="overflow-x-auto p-6 z-[10]">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="table-auto w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="p-4 text-left min-w-[180px]">Product Name</th>
                <th className="p-4 text-left w-32 min-w-[120px] max-w-xs">Description</th>
                <th className="p-4 text-left w-56 min-w-[140px] whitespace-nowrap">Price</th>
                <th className="p-4 text-left min-w-[100px] whitespace-nowrap">Quantity</th>
                <th className="p-4 text-left min-w-[110px]">Status</th>
                <th className="p-4 text-center min-w-[90px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id} className={`text-left ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                    <td className="p-4 flex items-center space-x-4">
                      <img
                        src={product.images?.length > 0 ? product.images[0] : "https://via.placeholder.com/64"}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <span>{product.name}</span>
                    </td>
                    <td className="p-4 w-40 max-w-xs truncate" title={product.description}>
                      {product.description}
                    </td>
                    <td className="p-4 w-56">
                      {Array.isArray(product.variants) && product.variants.length > 0
                        ? (() => {
                            const prices = product.variants
                              .map(v => v.price)
                              .filter(price => typeof price === "number" && !isNaN(price));
                            if (prices.length === 0) return "N/A";
                            const min = Math.min(...prices);
                            const max = Math.max(...prices);
                            return min === max
                              ? `₱${min.toFixed(2)}`
                              : `₱${min.toFixed(2)} - ₱${max.toFixed(2)}`;
                          })()
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      {Array.isArray(product.variants) && product.variants.length > 0
                        ? product.variants.reduce((sum, v) => sum + (v.quantity || 0), 0)
                        : "N/A"}
                    </td>
                    <td className={`p-4 font-bold ${product.isActive ? "text-green-600" : "text-red-600"}`}>
                      {product.isActive ? "Available" : "Archived"}
                      <label className="relative inline-flex items-center cursor-pointer ml-2">
                        <input
                          type="checkbox"
                          checked={product.isActive}
                          onChange={() => handleToggleProduct(product._id, !product.isActive)}
                          className="sr-only peer"
                        />
                        <div
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                            product.isActive ? "bg-green-500" : "bg-gray-400"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 bg-white rounded-full shadow-md transform transition-transform ${
                              product.isActive ? "translate-x-6" : "translate-x-0"
                            }`}
                          ></div>
                        </div>
                      </label>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center space-x-3 items-center">
                        <FiEdit className="cursor-pointer hover:text-blue-500 transition" onClick={() => handleEditClick(product._id)} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && <CreateProduct onProductAdded={handleProductAdded} onClose={handleCloseAddModal} />}
      {isEditModalOpen && selectedProductId && (
        <EditProduct productId={selectedProductId} isOpen={isEditModalOpen} onProductUpdated={handleProductUpdated} onClose={handleCloseEditModal} />
      )}
    </div>
  );
}
