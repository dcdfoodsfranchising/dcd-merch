import React, { useState } from "react";

export default function ProfileDropdown({ onOrdersClick, onLogoutClick, username, onUpdateUsername }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onUpdateUsername(newUsername); // Call the update username function
    setIsEditing(false);
  };

  return (
    <div className="absolute right-4 mt-20 w-64 bg-white shadow-lg rounded-md py-4 z-50">
      {/* Editable Username */}
      <div className="flex items-center px-4 py-2 border-b border-gray-200">
        {isEditing ? (
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
          />
        ) : (
          <span className="flex-1 text-gray-700 font-medium truncate">{username}</span>
        )}
        {isEditing ? (
          <button
            onClick={handleSaveClick}
            className="ml-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
          >
            Save
          </button>
        ) : (
          <button
            onClick={handleEditClick}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <img src="/assets/icons/edit.svg" alt="Edit" className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Orders Button */}
      <button
        onClick={onOrdersClick}
        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        My Orders
      </button>

      {/* Logout Button */}
      <button
        onClick={onLogoutClick}
        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
}