import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiShoppingCart, FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import LogoutModal from "../Auth/LogoutModal"; // ✅ Import LogoutModal
import UserContext from "../../context/UserContext"; // ✅ Import UserContext

export default function AdminSidebar({ isExpanded, toggleSidebar }) {
  const { setUser } = useContext(UserContext); // ✅ Get setUser to clear user state
  const [isLogoutOpen, setIsLogoutOpen] = useState(false); // ✅ State to manage logout modal
  const navigate = useNavigate();

  // ✅ Handle logout confirmation
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Clear token
    setUser(null); // ✅ Reset user context
    setIsLogoutOpen(false); // ✅ Close modal
    navigate("/"); // ✅ Redirect to home
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
              onClick={() => navigate("/dashboard")}
            >
              <FiHome size={24} />
              <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
                Dashboard
              </span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
              onClick={() => navigate("/orders")}
            >
              <FiShoppingCart size={24} />
              <span className={`transition-all ${isExpanded ? "ml-4 text-left w-full" : "text-center text-xs mt-1"}`}>
                Orders
              </span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full px-4 py-3 hover:bg-gray-700 ${isExpanded ? "justify-start" : "flex-col justify-center"}`}
              onClick={() => setIsLogoutOpen(true)} // ✅ Open logout modal
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
