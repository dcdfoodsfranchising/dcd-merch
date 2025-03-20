import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import AppNavbar from "./components/AppNavbar/AppNavbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import { UserProvider } from "./context/UserContext"; 
import UserContext from "./context/UserContext"; 
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminSidebar from "./components/AppNavbar/AdminSidebar";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

function UserRedirector() {
  const navigate = useNavigate();
  const { user } = React.useContext(UserContext);

  useEffect(() => {
    if (!user?.id || !user?.isAdmin) {
      navigate("/"); // ✅ Redirect if user is not logged in OR is not an admin
    } else if (user?.isAdmin) {
      navigate("/dashboard"); // ✅ Redirect admin users to Dashboard
    }
  }, [user, navigate]);

  return null;
}


function App() {
  // Global user state
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

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

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null });
  };

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser }}>
      <Router>
        <UserRedirector /> {/* ✅ Handles navigation logic */}
        <div className="flex">
          {user?.isAdmin && <AdminSidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />}
          <main className={`transition-all duration-300 flex-1 ${user?.isAdmin ? (isSidebarExpanded ? "ml-64" : "ml-20") : "ml-0"}`}>
            {!user?.isAdmin && <AppNavbar />}
            <div className="p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ✅ Protect admin-only routes */}
              <Route path="/dashboard" element={<ProtectedRoute component={AdminDashboard} />} />
              {/* <Route path="/orders" element={<ProtectedRoute component={AdminOrders} />} /> ✅ Make sure this is accessible */}
            </Routes>

            </div>
          </main>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
