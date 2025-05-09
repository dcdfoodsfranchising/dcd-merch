import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function ProfileDropdown({ onOrdersClick, onLogoutClick, onClose }) {
  const { user } = useContext(UserContext); // Access user from context
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    navigate("/profile"); // Redirect to the profile page
    onClose(); // Close the dropdown
  };

  // Close dropdown when clicking outside or on the dropdown itself
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onClose(); // Call the onClose function to close the dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-4 mt-20 w-64 bg-white shadow-lg rounded-md py-2 z-50"
    >
      {/* Profile Section */}
      <div
        onClick={handleProfileClick}
        className="flex items-center px-4 py-2 pb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 w-full"
      >
        <img
          src={user?.profilePicture || "/assets/icons/profile.svg"} // Show user's profile picture or fallback icon
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover mr-3"
        />
        <div className="flex flex-col">
          <span className="text-gray-700 font-medium text-sm truncate">{user?.username}</span>
          <span className="text-gray-500 text-sm">View Profile</span>
        </div>
      </div>

      {/* Orders Button */}
      <button
        onClick={() => {
          onOrdersClick();
          onClose(); // Close the dropdown
        }}
        className="flex items-center px-4 py-1 pt-3 text-gray-700 hover:bg-gray-100 w-full"
      >
        <img src="/assets/icons/receipt.svg" className="w-7 h-7 object-cover mr-3" alt="Orders" />
        <span className="text-gray-700 font-medium text-sm truncate">Orders</span>
      </button>

      {/* Logout Button */}
      <button
        onClick={() => {
          onLogoutClick();
          onClose(); // Close the dropdown
        }}
        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
      >
        <img src="/assets/icons/logout.svg" className="w-7 h-7 object-cover mr-3" alt="Logout" />
        <span className="text-gray-700 font-medium text-sm truncate">Logout</span>
      </button>
    </div>
  );
}