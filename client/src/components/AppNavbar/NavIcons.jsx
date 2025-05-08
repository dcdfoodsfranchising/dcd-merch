import React, { useEffect, useState } from "react";

export default function NavIcons({ onProfileClick, onCartClick, profilePicture, username, isDropdownActive }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Synchronize local state with the parent-provided isDropdownActive prop
  useEffect(() => {
    setIsDropdownOpen(isDropdownActive);
  }, [isDropdownActive]);

  const handleProfileClick = () => {
    const newState = !isDropdownOpen;
    onProfileClick(newState); // Notify parent of the new state
  };

  return (
    <div className="flex items-center space-x-6">
      {/* Cart Icon */}
      <button onClick={onCartClick} className="text-gray-600 hover:text-gray-900">
        <img src="/assets/icons/cart.svg" alt="Cart" className="w-8" />
      </button>

      {/* Profile Icon with Username */}
      <button
        onClick={handleProfileClick}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <img
          src={profilePicture || "/assets/icons/profile.svg"}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="hidden md:block text-gray-700 font-medium">{username}</span>
        <img
          src="/assets/icons/arrow-down.svg" // Use a single arrow-down icon
          alt="Dropdown"
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : "rotate-0"
          }`} // Rotate the arrow when active
        />
      </button>
    </div>
  );
}