import React, { useState } from "react";
import { archiveProduct } from "../../services/productService";

export default function ArchiveProduct({ productId, fetchProducts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleArchive = async () => {
    try {
      await archiveProduct(productId);
      setIsModalOpen(false); // ✅ Close modal after success
      fetchProducts(); // ✅ Refresh product list after archiving
    } catch (error) {
      console.error("Error archiving product:", error);
      setErrorMessage("Failed to archive product.");
    }
  };

  return (
    <div>
      {/* Archive Button */}
      <button
        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
        onClick={() => setIsModalOpen(true)}
      >
        Archive
      </button>

      {/* Archive Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Archive Product?</h2>
            {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
            <p className="mb-4">Are you sure you want to archive this product?</p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-3 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                onClick={handleArchive}
              >
                Yes, Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
