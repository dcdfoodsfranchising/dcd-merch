export default function MobileMenu({ menuOpen, toggleMenu, onProfileClick }) {
    if (!menuOpen) return null;
  
    return (
      <div className="fixed top-0 right-0 h-screen w-2/3 bg-red-800 shadow-lg z-50 transition-transform duration-300">
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
  
            <button className="text-white flex items-center space-x-2 hover:bg-red-800 py-2 px-3 rounded">
              <img src="/assets/icons/favorite2.svg" alt="Favorites" className="w-6" />
              <span className="pl-2">Favorites</span>
            </button>
            <button className="text-white flex items-center space-x-2 hover:bg-red-800 py-2 px-3 rounded">
              <img src="/assets/icons/cart2.svg" alt="Cart" className="w-7" />
              <span className="pl-2">Cart</span>
            </button>
  
            <button
              className="text-white flex items-center space-x-2 hover:bg-red-800 py-2 px-3 rounded w-full"
              onClick={onProfileClick}
            >
              <img src="/assets/icons/profile2.svg" alt="Profile" className="w-7" />
              <span className="pl-2">Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  