import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { FiBox, FiLogOut, FiShoppingCart } from "react-icons/fi"; // Use FiLogOut for logout

export default function MobileMenu({ menuOpen, toggleMenu }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  if (!menuOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-screen w-3/4 bg-red-800 shadow-lg z-50 transition-transform duration-300">
      <div className="flex flex-col h-full">
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu}>
            <img src="/assets/icons/close.svg" alt="Close" className="w-6" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col space-y-3 px-3">
          <div className="flex justify-center pb-8">
            <img src="/assets/logo/logo-white.png" className="w-40" alt="Logo" />
          </div>

          {/* Profile */}
          <button
            className="w-full flex items-center space-x-3 text-gray-200 hover:bg-red-700 py-3 px-3 rounded"
            onClick={() => {
              navigate("/profile");
              toggleMenu();
            }}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover border border-gray-300"
              />
            ) : (
              <FaRegUserCircle className="w-7 h-7" />
            )}
            <span className="font-semibold text-base truncate">
              {user?.username || "Profile"}
            </span>
          </button>

          {/* Cart */}
          <button
            className="w-full flex items-center space-x-3 text-gray-200 hover:bg-red-700 py-3 px-3 rounded"
            onClick={() => {
              navigate("/cart");
              toggleMenu();
            }}
          >
            <FiShoppingCart className="w-7 h-7" />
            <span className="font-semibold text-base">Cart</span>
          </button>

          {/* Orders */}
          <button
            className="w-full flex items-center space-x-3 text-gray-200 hover:bg-red-700 py-3 px-3 rounded"
            onClick={() => {
              navigate("/orders");
              toggleMenu();
            }}
          >
            <FiBox className="w-7 h-7" />
            <span className="font-semibold text-base">Orders</span>
          </button>

          {/* Logout */}
          <button
            className="w-full flex items-center space-x-3 text-gray-200 hover:bg-red-700 py-3 px-3 rounded"
            onClick={() => {
              window.location.href = "/logout";
            }}
          >
            <FiLogOut className="w-7 h-7" />
            <span className="font-semibold text-base">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
