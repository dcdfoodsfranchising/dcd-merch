import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar/AppNavbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import { UserProvider } from "./context/UserContext"; 
import UserContext from "./context/UserContext"; 
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

function App() {
  // Global user state
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });


  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        
        if (data.user?._id) {
          setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        } else {
          setUser({ id: null, isAdmin: null });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    fetchUser();
  }, []);

  // Function for clearing localStorage on logout
  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null });
  };

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
