import React, { useState } from "react";

const ProductSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="p-4 bg-white rounded-lg flex gap-2">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-1/3 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      {/* Search Button */}
      <button 
        onClick={handleSearch} 
        className="bg-red-700 text-white px-4 py-2 rounded-full hover:bg-red-800"
      >
        Search
      </button>
    </div>
  );
};

export default ProductSearch;
