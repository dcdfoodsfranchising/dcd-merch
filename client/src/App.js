import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation, Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AppNavbar from "./components/AppNavbar/AppNavbar";
import { UserProvider } from "./context/UserContext";
import UserContext from "./context/UserContext";
import AdminSidebar from "./components/AppNavbar/AdminSidebar";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import SkeletonAppLoader from "./components/SkeletonAppLoader"; // <-- import the skeleton loader

// Lazy load route components
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Register = lazy(() => import("./components/Auth/Register"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const DetailsForm = lazy(() => import("./pages/DetailsForm"));
const CheckoutPage = lazy(() => import("./pages/Checkout"));
const ProductView = lazy(() => import("./pages/ProductView"));
const Profile = lazy(() => import("./pages/Profile"));

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
  const [user, setUser] = useState({ id: null, isAdmin: null, profilePicture: null, username: null });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        console.log(token)
        if (!token) {
          setUser({ id: null, isAdmin: null, profilePicture: null, username: null });
          setLoading(false);
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.user?._id) {
          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin,
            profilePicture: data.user.profilePicture || null,
            username: data.user.username || "Guest",
          });
        } else {
          setUser({ id: null, isAdmin: null, profilePicture: null, username: null });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser({ id: null, isAdmin: null, profilePicture: null, username: null });
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null, profilePicture: null, username: null });
  };

  const updateUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.user?._id) {
        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin,
          profilePicture: data.user.profilePicture || null,
          username: data.user.username || "Guest",
        });
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}>
      <UserContext.Provider value={{ user, setUser, unsetUser, cart, setCart, updateUserDetails }}>
        <Router>
          <UserRedirector />
          <div className="flex">
            {user?.isAdmin && <AdminSidebar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />}
            <main className={`transition-all duration-300 flex-1 ${user?.isAdmin ? (isSidebarExpanded ? "ml-64" : "ml-20") : "ml-0"}`}>
              {loading ? (
                <SkeletonAppLoader />
              ) : (
                <Suspense fallback={<SkeletonAppLoader />}>
                  <Routes>
                    {/* Routes WITH navbar */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/product/:productId" element={<ProductView />} />
                      <Route path="/profile" element={<Profile />} />
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
                </Suspense>
              )}
            </main>
          </div>
        </Router>
      </UserContext.Provider>
    </GoogleReCaptchaProvider>
  );
}

export default App;