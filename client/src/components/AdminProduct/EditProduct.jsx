import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { 
    getProductById, 
    updateProductInfo, 
    uploadProductImages, 
    deleteProductImage, 
    deleteProduct 
} from "../../services/productService";

export default function EditProduct({ productId, isOpen, onClose, onProductUpdated }) {
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "",
        images: [],
    });

    const [loading, setLoading] = useState(false);
    const [newImages, setNewImages] = useState([]); 
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); // State for delete confirmation modal

    // Fetch product details when modal opens
    useEffect(() => {
        if (isOpen && productId) {
            const fetchProductData = async () => {
                try {
                    const response = await getProductById(productId);
                    const product = response.product;

                    setProductData({
                        name: product.name || "",
                        description: product.description || "",
                        price: product.price || "",
                        quantity: product.quantity || "",
                        images: product.images || [],
                    });
                } catch (error) {
                    toast.error(`Failed to load product: ${error.message}`);
                }
            };
            fetchProductData();
        }
    }, [isOpen, productId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
    };

    const handleDeleteImage = async (imageUrl) => {
        try {
            await deleteProductImage(productId, imageUrl);
            setProductData((prevState) => ({
                ...prevState,
                images: prevState.images.filter((img) => img !== imageUrl),
            }));
            toast.success("Image deleted successfully!");
        } catch (error) {
            toast.error("Failed to delete image.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // Upload new images if any are selected
            let uploadedImages = [];
            if (newImages.length > 0) {
                const formData = new FormData();
                newImages.forEach((image) => {
                    formData.append("images", image);
                });

                const uploadResponse = await uploadProductImages(productId, formData);
                uploadedImages = uploadResponse.images; // Get new image URLs
            }

            // Update product with new images
            const updatedProductData = {
                ...productData,
                images: [...productData.images, ...uploadedImages], // Append new images
            };

            await updateProductInfo(productId, updatedProductData);
            toast.success("Product updated successfully!");
            onProductUpdated();
            onClose();
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Handle product deletion with confirmation modal
    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(productId);
            toast.success("Product deleted successfully!");
            setIsConfirmDeleteOpen(false); // Close confirmation modal
            onClose(); // Close edit modal
            onProductUpdated(); // Refresh product list
        } catch (error) {
            toast.error("Failed to delete product.");
        }
    };

    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                
                {/* Close Icon (Top Right) */}
                <button 
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" 
                    onClick={onClose}
                >
                    <FiX size={24} />
                </button>

                <h2 className="text-lg font-bold mb-4">Edit Product</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        name="name" 
                        value={productData.name} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full p-2 border" 
                    />
                    <textarea 
                        name="description" 
                        value={productData.description} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full p-2 border"
                    ></textarea>
                    <input 
                        type="number" 
                        name="price" 
                        value={productData.price} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full p-2 border" 
                    />
                    <input 
                        type="number" 
                        name="quantity" 
                        value={productData.quantity} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full p-2 border" 
                    />
                    
                    {/* Display existing images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Existing Images</label>
                        <div className="flex space-x-2">
                            {productData.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img src={image} alt="Product" className="w-20 h-20 object-cover rounded" />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                                        onClick={() => handleDeleteImage(image)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upload new images */}
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Upload New Images</label>
                        <input 
                            type="file" 
                            name="images" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="w-full p-2 border" 
                        />
                    </div>

                    {/* Delete & Update Buttons */}
                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                            onClick={() => setIsConfirmDeleteOpen(true)}
                        >
                            Delete
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? "Updating..." : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Confirmation Modal */}
            {isConfirmDeleteOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this product?</h2>
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                                onClick={() => setIsConfirmDeleteOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                onClick={handleDeleteProduct}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
