import React, { useState } from "react";
import { createProduct } from "../../services/productService";

export default function CreateProduct({ onProductAdded, onClose }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    images: [],
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewProduct((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files],
    }));

    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevState) => [...prevState, ...imagePreviews]);
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

        <form onSubmit={handleAddProduct} encType="multipart/form-data">
          <input type="text" name="name" placeholder="Product Name" required onChange={handleInputChange} className="w-full p-2 border mb-2" />
          <textarea name="description" placeholder="Description" required onChange={handleInputChange} className="w-full p-2 border mb-2"></textarea>
          <input type="number" name="price" placeholder="Price" required onChange={handleInputChange} className="w-full p-2 border mb-2" />
          <input type="number" name="quantity" placeholder="Quantity" required onChange={handleInputChange} className="w-full p-2 border mb-2" />

          {/* Image Upload Field */}
          <input type="file" name="images" multiple accept="image/*" onChange={handleImageChange} className="w-full p-2 border mb-2" />

          {/* Image Preview */}
          <div className="flex flex-wrap gap-2">
            {previewImages.map((image, index) => (
              <img key={index} src={image} alt="Preview" className="w-16 h-16 object-cover rounded" />
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add
            </button>
            <button type="button" onClick={onClose} className="ml-2 text-gray-500">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
