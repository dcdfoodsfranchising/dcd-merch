import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getProductById, updateProductInfo } from '../../services/productService'; // Ensure you have this service to get product by ID

export default function EditProduct({ productId, isOpen, onClose, onProductUpdated }) {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
    });

    const [loading, setLoading] = useState(false);

    // Fetch product details when the modal opens
    useEffect(() => {
        if (isOpen && productId) {
            const fetchProductData = async () => {
                try {
                    const response = await getProductById(productId); // Fetch the product
                    const product = response.product; // Extract product data from the response
                    console.log("Product data fetched:", product); // Check the fetched data
                    
                    setProductData({
                        name: product.name || '', 
                        description: product.description || '', 
                        price: product.price || '', 
                        image: product.image || '', // Handle image if it's empty
                    });
                } catch (error) {
                    toast.error(`Failed to load product: ${error.message}`);
                }
            };
    
            fetchProductData();
        }
    }, [isOpen, productId]);
    

    // Log the product data every time it updates
    useEffect(() => {
        console.log("Current product data:", productData); // Verify the state update
    }, [productData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!productData.name || !productData.price || !productData.description) {
            toast.error("Please fill in all required fields.");
            return;
        }
            
        try {
            setLoading(true);
            const updatedProduct = await updateProductInfo(productId, productData);
            toast.success('Product updated successfully!');
            onProductUpdated(updatedProduct.updatedProduct); // Notify parent component of the update
            onClose(); // Close the modal
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Edit Product</h2>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={productData.name} // Bind input value to state
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={productData.description} // Bind input value to state
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={productData.price} // Bind input value to state
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={productData.image} // Bind input value to state
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex justify-end mt-6 space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
