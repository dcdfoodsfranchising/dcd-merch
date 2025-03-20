import React, { useState } from "react";
import { createProduct } from "../../services/productService";

export default function CreateProduct({ onProductAdded, onClose }) {
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const addedProduct = await createProduct(newProduct);
      onProductAdded(addedProduct);
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage("Failed to add product.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add Product</h2>
        {errorMessage && <div className="bg-red-500 text-white p-2 rounded mb-2">{errorMessage}</div>}
        <form onSubmit={handleAddProduct}>
          <input type="text" name="name" placeholder="Product Name" required onChange={handleInputChange} className="w-full p-2 border mb-2" />
          <input type="text" name="description" placeholder="Description" required onChange={handleInputChange} className="w-full p-2 border mb-2" />
          <input type="number" name="price" placeholder="Price" required onChange={handleInputChange} className="w-full p-2 border mb-2" />
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
            <button type="button" onClick={onClose} className="ml-2 text-gray-500">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
