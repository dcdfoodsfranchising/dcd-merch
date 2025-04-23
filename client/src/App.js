import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation, Outlet } from "react-router-dom";
import AppNavbar from "./components/AppNavbar/AppNavbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import { UserProvider } from "./context/UserContext";
import UserContext from "./context/UserContext";
import Register from "./components/Auth/Register";
import AdminSidebar from "./components/AppNavbar/AdminSidebar";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import DetailsForm from "./pages/DetailsForm";
import CheckoutPage from "./pages/Checkout";
import ProductView from "./pages/ProductView";

function UserRedirector() {
  const navigate = useNavigate();
  const { user } = React.useContext(UserContext);

  useEffect(() => {
    if (user?.isAdmin && window.location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return null;
}

// Layout that includes AppNavbar
const MainLayout = () => {
  const location = useLocation();
  const { user } = React.useContext(UserContext);

  return (
    <>
      {!user?.isAdmin && <AppNavbar />}
      <div className="pt-24">
        <Outlet />
      </div>
    </>
  );
};

// Layout with no AppNavbar
const PlainLayout = () => (
  <div className="p-6">
    <Outlet />
  </div>
);

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: null });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        if (data.user?._id) {
          setUser({ id: data.user._id, isAdmin: data.user.isAdmin });
        } else {
          setUser({ id: null, isAdmin: null });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null });
  };

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser, cart, setCart }}>
      <Router>
        <UserRedirector />
        <div className="flex">
          {user?.isAdmin && <AdminSidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />}
          <main className={`transition-all duration-300 flex-1 ${user?.isAdmin ? (isSidebarExpanded ? "ml-64" : "ml-20") : "ml-0"}`}>
            {loading ? (
              <div className="text-center text-lg">Loading...</div>
            ) : (
              <Routes>
                {/* Routes WITH navbar */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/product/:productId" element={<ProductView />} />

                </Route>

                {/* Routes WITHOUT navbar */}
                <Route element={<PlainLayout />}>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/delivery" element={user?.id ? <DetailsForm /> : <Navigate to="/" />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/products" element={<ProtectedRoute component={AdminProducts} />} />
                <Route path="/admin/orders" element={<ProtectedRoute component={AdminOrders} />} />
                <Route path="/dashboard" element={<ProtectedRoute component={AdminDashboard} />} />
              </Routes>
            )}
          </main>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
