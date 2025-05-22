import React, { useState } from "react";
import { createProduct } from "../../services/productService";

export default function CreateProduct({ onProductAdded, onClose }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    images: [],
    variants: [
      { size: "", color: "", price: "", quantity: "" }
    ],
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

  // Variant handlers
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => {
      const updatedVariants = [...prevState.variants];
      updatedVariants[index][name] = value;
      return { ...prevState, variants: updatedVariants };
    });
  };

  const handleAddVariant = () => {
    setNewProduct((prevState) => ({
      ...prevState,
      variants: [...prevState.variants, { size: "", color: "", price: "", quantity: "" }],
    }));
  };

  const handleRemoveVariant = (index) => {
    setNewProduct((prevState) => {
      const updatedVariants = prevState.variants.filter((_, i) => i !== index);
      return { ...prevState, variants: updatedVariants };
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // Convert price and quantity to numbers for each variant
      const variants = newProduct.variants.map(v => ({
        ...v,
        price: Number(v.price),
        quantity: Number(v.quantity)
      }));
      const productToSend = { ...newProduct, variants };
      const addedProduct = await createProduct(productToSend);
      onProductAdded(addedProduct);
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage("Failed to add product.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Add Product</h2>
        {errorMessage && <div className="bg-red-500 text-white p-2 rounded mb-2">{errorMessage}</div>}

        <form onSubmit={handleAddProduct} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            required
            onChange={handleInputChange}
            className="w-full p-2 border mb-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleInputChange}
            className="w-full p-2 border mb-2"
          ></textarea>

          {/* Variants Section */}
          <div className="mb-4">
            <label className="font-semibold">Variants</label>
            {newProduct.variants.map((variant, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  name="size"
                  placeholder="Size"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(idx, e)}
                  className="p-2 border w-16"
                  required
                />
                <input
                  type="text"
                  name="color"
                  placeholder="Color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(idx, e)}
                  className="p-2 border w-20"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(idx, e)}
                  className="p-2 border w-20"
                  required
                  min="0"
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Qty"
                  value={variant.quantity}
                  onChange={(e) => handleVariantChange(idx, e)}
                  className="p-2 border w-16"
                  required
                  min="0"
                />
                {newProduct.variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-red-500 font-bold px-2"
                    title="Remove Variant"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-blue-500 text-sm underline"
            >
              + Add Variant
            </button>
          </div>

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
