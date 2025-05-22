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
        images: [],
        variants: [{ size: "", color: "", price: "", quantity: "" }],
    });

    const [loading, setLoading] = useState(false);
    const [newImages, setNewImages] = useState([]); 
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

    // Fetch product details when modal opens
    useEffect(() => {
        if (isOpen && productId) {
            const fetchProductData = async () => {
                try {
                    const product = await getProductById(productId);
                    setProductData({
                        name: product.name || "",
                        description: product.description || "",
                        images: product.images || [],
                        variants: Array.isArray(product.variants) && product.variants.length > 0
                            ? product.variants.map(v => ({
                                size: v.size || "",
                                color: v.color || "",
                                price: v.price || "",
                                quantity: v.quantity || ""
                            }))
                            : [{ size: "", color: "", price: "", quantity: "" }]
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

    // Variant handlers
    const handleVariantChange = (index, e) => {
        const { name, value } = e.target;
        setProductData((prevState) => {
            const updatedVariants = [...prevState.variants];
            updatedVariants[index][name] = value;
            return { ...prevState, variants: updatedVariants };
        });
    };

    const handleAddVariant = () => {
        setProductData((prevState) => ({
            ...prevState,
            variants: [...prevState.variants, { size: "", color: "", price: "", quantity: "" }],
        }));
    };

    const handleRemoveVariant = (index) => {
        setProductData((prevState) => {
            const updatedVariants = prevState.variants.filter((_, i) => i !== index);
            return { ...prevState, variants: updatedVariants };
        });
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
                const uploadResponse = await uploadProductImages(productId, newImages);
                uploadedImages = uploadResponse.images || [];
            }

            // Prepare variants with correct types
            const variants = productData.variants.map(v => ({
                ...v,
                price: Number(v.price),
                quantity: Number(v.quantity)
            }));

            // Update product with new images and variants
            const updatedProductData = {
                ...productData,
                images: [...productData.images, ...uploadedImages],
                variants
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
            setIsConfirmDeleteOpen(false);
            onClose();
            onProductUpdated();
        } catch (error) {
            toast.error("Failed to delete product.");
        }
    };

    if (!isOpen) return null; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto relative">
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
                        className="w-full p-2 border"
                    ></textarea>
                    {/* description is now optional */}

                    {/* Variants Section */}
                    <div>
                        <label className="font-semibold">Variants</label>
                        {productData.variants.map((variant, idx) => (
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
                                {productData.variants.length > 1 && (
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
