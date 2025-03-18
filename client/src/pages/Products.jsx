import React, { useEffect, useState, useCallback, useContext } from "react";
import UserView from "../components/UserRole/UserView";
import AdminView from "../components/UserRole/AdminView";
import UserContext from "../context/UserContext";

export default function Products() {
    const { user } = useContext(UserContext);
    const isAdmin = user?.isAdmin;
    const userId = user?.id;
    const token = user?.token || localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchData = useCallback(async () => {
        const fetchUrl = isAdmin
            ? `${process.env.REACT_APP_API_BASE_URL}/products/all`  // Admins get all products
            : `${process.env.REACT_APP_API_BASE_URL}/products/active`;  // Guests & Users get active products
    
        try {
    
            // ✅ Allow request even if no token is available
            const headers = token 
                ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
                : {};
    
            const response = await fetch(fetchUrl, { headers });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error fetching data: ${errorText}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
    
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [isAdmin, userId, token]);
    

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
            <h1 className="text-center text-2xl font-bold mb-6">{isAdmin ? "Admin Dashboard" : "Available Products"}</h1>
            {isAdmin ? (
                <AdminView productsData={products} fetchData={fetchData} />
            ) : (
                <UserView productsData={products} />
            )}
        </div>
    );
}
