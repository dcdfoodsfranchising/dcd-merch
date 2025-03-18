export default function NavIcons({ onProfileClick }) {
    return (
      <div className="hidden md:flex items-center space-x-6 pr-6">
        <button className="text-gray-600 hover:text-gray-900">
          <img src="/assets/icons/favorite.svg" alt="Favorites" className="w-6" />
        </button>
        <button className="text-gray-600 hover:text-gray-900">
          <img src="/assets/icons/cart.svg" alt="Cart" className="w-7" />
        </button>
        <button
          onClick={onProfileClick}
          className="text-gray-600 hover:text-gray-900"
        >
          <img src="/assets/icons/profile.svg" alt="Profile" className="w-7" />
        </button>
      </div>
    );
  }
  