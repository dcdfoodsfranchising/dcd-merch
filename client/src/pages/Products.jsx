import React, { useEffect, useState, useCallback, useContext } from "react";
import UserView from "../components/UserRole/UserView";
import UserContext from "../context/UserContext";

export default function Products() {
  const { user } = useContext(UserContext);
  const token = user?.token || localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    const fetchUrl = `${process.env.REACT_APP_API_BASE_URL}/products/active`;

    try {
      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        : {};

      const response = await fetch(fetchUrl, { headers });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching data: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <h2 className="text-center text-lg font-semibold mt-10">Loading products...</h2>;
  }

  if (error) {
    return <h2 className="text-center text-red-600 font-semibold mt-10">Error: {error}</h2>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-2xl font-bold mb-6">Available Products</h1>
      <UserView productsData={products} />
    </div>
  );
}
