import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiShoppingCart, FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import io from "socket.io-client"; // ✅ Import socket.io-client
import LogoutModal from "../Auth/LogoutModal";
import UserContext from "../../context/UserContext";
import { fetchAllOrders } from "../../services/orderService"; // ✅ Import order fetch function

const socket = io(process.env.REACT_APP_API_BASE_URL); // ✅ Connect to WebSocket server

export default function AdminSidebar({ isExpanded, toggleSidebar }) {
  const { setUser } = useContext(UserContext);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0); // ✅ Track pending order count
  const navigate = useNavigate();

  useEffect(() => {
    loadPendingOrders();

    // ✅ Listen for real-time new orders
    socket.on("newOrder", (newOrder) => {
      console.log("📢 New Order Received:", newOrder);
      setPendingCount((prevCount) => prevCount + 1); // ✅ Increase pending count
    });

    return () => {
      socket.off("newOrder"); // Cleanup socket on unmount
    };
  }, []);

  const loadPendingOrders = async () => {
    try {
      const data = await fetchAllOrders();
      if (data && data.orders) {
        const pendingOrders = data.orders.filter(order => order.status === "Pending");
        setPendingCount(pendingOrders.length); // ✅ Set initial pending order count
      }
    } catch (error) {
      console.error("Error fetching pending orders:", error);
    }
  };

  // ✅ Handle logout confirmation
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
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
              onClick={() => navigate("/admin/products")}
            >
              <FiHome size={24} />
              <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
                Products
              </span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 relative ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
              onClick={() => navigate("/admin/orders")}
            >
              <FiShoppingCart size={24} />
              <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
                Orders
              </span>

              {/* ✅ Show badge for pending orders */}
              {pendingCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          </li>
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

      {/* ✅ Logout Modal */}
      {isLogoutOpen && <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} onConfirm={handleLogout} />}
    </div>
  );
}
