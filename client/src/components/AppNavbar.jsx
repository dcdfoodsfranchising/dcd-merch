import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import LogoutModal from "./Auth/LogoutModal";
import ProfileModal from "./Auth/ProfileModal";

export default function AppNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex-grow flex justify-center">
            <img src="/assets/logo/logo.png" alt="Logo" className="w-32 md:w-36 lg:w-40" />
          </div>

          {/* Burger Menu - Small Screens */}
          <button
            className="block md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <img src="/assets/icons/burgerMenu.svg" alt="Menu" className="w-8" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 pr-6">
            <button className="text-gray-600 hover:text-gray-900">
              <img src="/assets/icons/favorite.svg" alt="Favorites" className="w-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <img src="/assets/icons/cart.svg" alt="Cart" className="w-7" />
            </button>

            {/* Profile Icon - Dropdown for Logged-in Users, Modal for Guests */}
            <div className="relative">
              <button
                onClick={() => {
                  if (user) {
                    setProfileDropdownOpen(!profileDropdownOpen);
                  } else {
                    setProfileModalOpen(true);
                  }
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                <img src="/assets/icons/profile.svg" alt="Profile" className="w-7" />
              </button>

              {/* Profile Dropdown (Only for Logged-in Users) */}
              {user && profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate("/orders");
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      setLogoutModalOpen(true);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (RED-700 Background) */}
      {menuOpen && (
        <div className="fixed top-0 right-0 h-screen w-2/3 bg-red-800 shadow-lg z-50 transition-transform duration-300">
          <div className="flex flex-col h-full">
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button onClick={() => setMenuOpen(false)}>
                <img src="/assets/icons/close.svg" alt="Close" className="w-6" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-3 px-3">
              <div className="flex justify-center pb-8">
                <img src="/assets/logo/logo-white.png" className="w-40" alt="" />
              </div>

              <button className="text-white flex items-center space-x-2 hover:bg-red-800 py-2 px-3 rounded">
                <img src="/assets/icons/favorite2.svg" alt="Favorites" className="w-6" />
                <span className="pl-2">Favorites</span>
              </button>
              <button className="text-white flex items-center space-x-2 hover:bg-red-800 py-2 px-3 rounded">
                <img src="/assets/icons/cart2.svg" alt="Cart" className="w-7" />
                <span className="pl-2">Cart</span>
              </button>

              {/* Profile Button - Dropdown (if logged in) or Modal (if guest) */}
              <div className="relative">
                <button
                  className="text-white flex items-center space-x-2 hover:bg-red-800 py-2 px-3 rounded w-full"
                  onClick={() => {
                    if (user) {
                      setProfileDropdownOpen(!profileDropdownOpen);
                    } else {
                      setProfileModalOpen(true);
                      setMenuOpen(false);
                    }
                  }}
                >
                  <img src="/assets/icons/profile2.svg" alt="Profile" className="w-7" />
                  <span className="pl-2">Profile</span>
                </button>

                {/* Expandable Profile Menu for Logged-in Users */}
                {user && profileDropdownOpen && (
                  <div className="mt-2 bg-red-600 shadow-md rounded-lg py-2">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/orders");
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-red-500"
                    >
                      My Orders
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setLogoutModalOpen(true);
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal (for guest users) */}
      {profileModalOpen && (
        <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      )}

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={() => {
            setLogoutModalOpen(false);
            logout();
            navigate("/");
          }}
        />
      )}
    </>
  );
}
