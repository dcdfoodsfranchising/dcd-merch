import React, { useEffect, useState } from "react";
import ProductCard from "../components/Product/ProductCard";
import ProductSearch from "../components/Product/ProductSearch";
import { getActiveProducts } from "../services/productService";

const ProductView = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const data = await getActiveProducts();
      setProducts(data);
      setFilteredProducts(data);
      console.log(data);
    };

    getProducts();
  }, []);


  const handleSearch = (searchTerm) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="p-4">
      <ProductSearch onSearch={handleSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product._id} product={product} />)
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductView;
