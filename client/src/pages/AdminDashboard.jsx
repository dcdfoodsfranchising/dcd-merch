import React, { useState, useEffect } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";
import EditProduct from "../components/Product/EditProduct";
import CreateProduct from "../components/Product/CreateProduct";
import { activateProduct, archiveProduct, getAllProducts } from "../services/productService";

export default function AdminDashboard() {
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
  }, []);

  const handleEditClick = (productId) => {
    setSelectedProductId(productId);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProductId(null);
  };

  const handleProductUpdated = async () => {
    try {
      setProducts(await getAllProducts());
    } catch (error) {
      console.error("Error updating product list:", error);
    }
  };

  const handleToggleProduct = async (productId, isActive) => {
    try {
      isActive ? await activateProduct(productId) : await archiveProduct(productId);
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
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button onClick={handleOpenAddModal} className="group relative bg-red-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-red-600 transition">
          <FiPlus size={20} />
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition">Add Product</span>
        </button>
      </div>

      {errorMessage && <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">{errorMessage}</div>}

      <div className="relative overflow-x-auto">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="text-center bg-gray-200">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Description</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Quantity</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product._id} className="text-center">
                <td className="p-3 border">{product.name}</td>
                <td className="p-3 border">{product.description}</td>
                <td className="p-3 border">₱{product.price.toFixed(2)}</td>
                <td className="p-3 border">{product.quantity}</td>
                <td className={`p-3 border ${product.isActive ? "text-green-600" : "text-red-600"}`}>
                  {product.isActive ? "Available" : "Archived"}
                </td>
                <td className="p-3 border">
                  <div className="flex justify-center space-x-3 items-center">
                    <button className="text-black hover:text-blue-500 transition" onClick={() => handleEditClick(product._id)}>
                      <FiEdit size={24} />
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.isActive}
                        onChange={() => handleToggleProduct(product._id, !product.isActive)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full">
                        <div className="absolute top-1 left-1 bg-white border rounded-full w-4 h-4 transition-all peer-checked:translate-x-full"></div>
                      </div>
                    </label>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      </div>

      {isAddModalOpen && <CreateProduct onProductAdded={handleProductAdded} onClose={handleCloseAddModal} />}
    </div>
  );
}
