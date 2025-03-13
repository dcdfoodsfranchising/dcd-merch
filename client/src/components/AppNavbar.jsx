import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import LogoutModal from "./LogoutModal";

export default function AppNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo - Centered */}
          <div className="flex-grow flex justify-center">
            <img src="/assets/logo/logo.png" alt="Logo" className="w-32 md:w-36 lg:w-40" />
          </div>

          {/* Burger Menu - Only Visible on Small Screens */}
          <button
            className="block md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(true)}
          >
            <img src="/assets/icons/menu.svg" alt="Menu" className="w-7" />
          </button>

          {/* Desktop Navigation - Hidden on Small Screens */}
          <div className="hidden md:flex items-center space-x-6 pr-6">
            <button className="text-gray-600 hover:text-gray-900">
              <img src="/assets/icons/favorite.svg" alt="Favorites" className="w-6" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <img src="/assets/icons/cart.svg" alt="Cart" className="w-7" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <img src="/assets/icons/profile.svg" alt="Profile" className="w-7" />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2">
                  {user ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate("/login");
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigate("/register");
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu (2/3 Width, Full Height) */}
      <div
        className={`fixed top-0 right-0 h-screen w-2/3 bg-white shadow-lg transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button onClick={() => setMenuOpen(false)}>
              <img src="/assets/icons/close.svg" alt="Close" className="w-6" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col space-y-4 px-6">
            <button className="text-gray-700 flex items-center space-x-2 hover:bg-gray-100 py-2 px-3 rounded">
              <img src="/assets/icons/favorite.svg" alt="Favorites" className="w-6" />
              <span>Favorites</span>
            </button>
            <button className="text-gray-700 flex items-center space-x-2 hover:bg-gray-100 py-2 px-3 rounded">
              <img src="/assets/icons/cart.svg" alt="Cart" className="w-7" />
              <span>Cart</span>
            </button>

            {/* Profile Section */}
            <div className="relative">
              <button
                className="text-gray-700 flex items-center space-x-2 hover:bg-gray-100 py-2 px-3 rounded w-full"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <img src="/assets/icons/profile.svg" alt="Profile" className="w-7" />
                <span>Profile</span>
              </button>

              {/* Expandable Profile Menu */}
              {profileDropdownOpen && (
                <div className="mt-2 bg-gray-50 shadow-md rounded-lg py-2">
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/orders");
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setLogoutModalOpen(true);
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/login");
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/register");
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Spacer to Push Menu Content to the Top */}
          <div className="flex-grow"></div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={() => {
            setLogoutModalOpen(false);
            setMenuOpen(false);
            logout();
            navigate("/");
          }}
        />
      )}
    </>
  );
}
