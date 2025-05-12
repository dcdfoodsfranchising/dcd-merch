import { useState } from "react";
import useNavbarLogic from "../../hooks/useNavbarLogic";
import { useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";
import ProfileModal from "../Auth/ProfileModal";
import LogoutModal from "../Auth/LogoutModal";
import CartModal from "../UserCart/CartModal";

export default function AppNavbar() {
  const navigate = useNavigate();
  const {
    user,
    menuOpen,
    profileDropdownOpen,
    profileModalOpen,
    logoutModalOpen,
    toggleMenu,
    toggleProfileDropdown,
    openProfileModal,
    closeProfileModal,
    openLogoutModal,
    closeLogoutModal,
    logout,
  } = useNavbarLogic();

  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false); // State for Login Modal

  const handleProfileClick = () => {
    if (user?.id) {
      if (profileDropdownOpen) {
        toggleProfileDropdown(false); // Close the dropdown if it's open
      } else {
        toggleProfileDropdown(true); // Open the dropdown if it's closed
      }
    } else {
      setLoginModalOpen(true); // Open login modal if user is not logged in
    }
  };

  const handleCloseDropdown = () => {
    toggleProfileDropdown(false); // Close the dropdown
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex-grow flex justify-center">
            <a href="/">
              <img src="/assets/logo/logo.png" alt="Logo" className="w-32 md:w-36 lg:w-40" />
            </a>
          </div>

          {/* Burger Menu - Small Screens */}
          <button className="block md:hidden text-gray-600 hover:text-gray-900" onClick={toggleMenu}>
            <img src="/assets/icons/burgerMenu.svg" alt="Menu" className="w-8" />
          </button>

          {/* Desktop Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <button
              onClick={() => setCartModalOpen(true)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <img
                src="/assets/icons/cart.svg" // Cart icon
                alt="Cart"
                className="w-8 h-8"
              />
            </button>

            {/* Profile Icon */}
            <button
              onClick={handleProfileClick}
              className="relative flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <img
                src={user?.profilePicture || "/assets/icons/profile.svg"} // Show user's profile picture or fallback icon
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              {user?.id && (
                <div
                  className={`absolute -bottom-1 -right-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center transform transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <img
                    src="/assets/icons/arrow-down.svg" // Arrow icon only shown if user is logged in
                    alt="Dropdown"
                    className="w-2.5 h-2.5"
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} onProfileClick={openProfileModal} />

      {/* Profile Dropdown */}
      {user?.id && profileDropdownOpen && (
        <ProfileDropdown
          username={user?.username}
          onOrdersClick={() => navigate("/orders")}
          onLogoutClick={openLogoutModal}
          onClose={() => toggleProfileDropdown(false)}
          onUpdateUsername={(newUsername) => {
            console.log("Updated username:", newUsername);
          }}
          isLoggedIn={!!user?.id} // Check if the user is logged in
          onLoginRedirect={() => setLoginModalOpen(true)} // Open login modal if not logged in
        />
      )}

      {/* Login Modal */}
      {!user?.id && loginModalOpen && (
        <ProfileModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      )}

      {/* Modals */}
      {profileModalOpen && <ProfileModal isOpen={profileModalOpen} onClose={closeProfileModal} />}
      {logoutModalOpen && <LogoutModal isOpen={logoutModalOpen} onClose={closeLogoutModal} onConfirm={logout} />}
      <CartModal isOpen={cartModalOpen} onClose={() => setCartModalOpen(false)} /> {/* Cart Modal */}
    </>
  );
}