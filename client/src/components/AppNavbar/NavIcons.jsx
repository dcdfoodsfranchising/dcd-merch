import React from 'react';

export default function NavIcons({ onProfileClick, onCartClick }) {
  return (
    <div className="flex space-x-6">
      <button onClick={onCartClick} className="text-gray-600 hover:text-gray-900">
        <img src="/assets/icons/cart.svg" alt="Cart" className="w-8" />
      </button>

      <button onClick={onProfileClick} className="text-gray-600 hover:text-gray-900">
        <img src="/assets/icons/profile.svg" alt="Profile" className="w-8" />
      </button>
    </div>
  );
}
