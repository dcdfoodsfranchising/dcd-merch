import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiBox, 
  FiShoppingCart, 
  FiLogOut, 
  FiChevronLeft, 
  FiChevronRight, 
  FiBarChart2 
} from "react-icons/fi"; // ✅ Import new icons
import io from "socket.io-client";
import ReactDOM from "react-dom";
import LogoutModal from "../Auth/LogoutModal";
import UserContext from "../../context/UserContext";
import { fetchAllOrders } from "../../services/orderService";

const socket = io(process.env.REACT_APP_API_BASE_URL);

export default function AdminSidebar({ isExpanded, toggleSidebar }) {
  const { setUser } = useContext(UserContext);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadPendingOrders();

    socket.on("newOrder", (newOrder) => {
      console.log("📢 New Order Received:", newOrder);
      setPendingCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  const loadPendingOrders = async () => {
    try {
      const data = await fetchAllOrders();
      if (data && data.orders) {
        const pendingOrders = data.orders.filter(order => order.status === "Pending");
        setPendingCount(pendingOrders.length);
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLogoutOpen(false);
    navigate("/");
  };

  return (
    <div className={`h-screen bg-gray-800 text-white fixed top-0 left-0 transition-all duration-300 flex flex-col justify-between ${isExpanded ? "w-64" : "w-20"}`}>
      
      {/* Logo */}
      <div className="p-4 flex justify-center">
        <img
          src="/assets/logo/logo.png"
          alt="Logo"
          className={`transition-all ${isExpanded ? "w-32" : "w-10"}`}
        />
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-grow">
        <ul className="space-y-2">

          {/* Dashboard */}
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
              onClick={() => navigate("/dashboard")}
            >
              <FiBarChart2 size={24} /> {/* ✅ Dashboard Icon */}
              <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
                Dashboard
              </span>
            </button>
          </li>

          {/* Products */}
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
              onClick={() => navigate("/admin/products")}
            >
              <FiBox size={24} /> {/* ✅ Changed from FiHome to FiBox */}
              <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
                Products
              </span>
            </button>
          </li>

          {/* Orders */}
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 relative ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
              onClick={() => navigate("/admin/orders")}
            >
              <FiShoppingCart size={24} />
              <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
                Orders
              </span>

              {/* Show pending orders count */}
              {pendingCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          </li>

          {/* Logout */}
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
              onClick={() => setIsLogoutOpen(true)}
            >
              <FiLogOut size={24} />
              <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
        >
          {isExpanded ? <FiChevronLeft size={24} /> : <FiChevronRight size={24} />}
          <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
            {isExpanded ? "Collapse" : "Expand"}
          </span>
        </button>
      </div>

      {/* Logout Modal */}
      {isLogoutOpen &&
        ReactDOM.createPortal(
          <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={handleLogout} />,
          document.body
        )
      }
    </div>
  );
}
