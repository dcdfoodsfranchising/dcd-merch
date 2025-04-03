import { useState } from "react";
import useNavbarLogic from "../../hooks/useNavbarLogic";
import { useNavigate } from "react-router-dom";
import NavIcons from "./NavIcons";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";
import ProfileModal from "../Auth/ProfileModal";
import LogoutModal from "../Auth/LogoutModal";
import CartModal from "../UserCart/CartModal"; // Import CartModal

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
          <NavIcons 
            onProfileClick={user?.id ? toggleProfileDropdown : openProfileModal} 
            onCartClick={() => setCartModalOpen(true)} // Open Cart Modal on Cart Click
          />
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu menuOpen={menuOpen} toggleMenu={toggleMenu} onProfileClick={openProfileModal} />

      {/* Profile Dropdown */}
      {user?.id && profileDropdownOpen && (
        <ProfileDropdown onOrdersClick={() => navigate("/orders")} onLogoutClick={openLogoutModal} />
      )}

      {/* Modals */}
      {profileModalOpen && <ProfileModal isOpen={profileModalOpen} onClose={closeProfileModal} />}
      {logoutModalOpen && <LogoutModal isOpen={logoutModalOpen} onClose={closeLogoutModal} onConfirm={logout} />}
      <CartModal isOpen={cartModalOpen} onClose={() => setCartModalOpen(false)} /> {/* Cart Modal */}
    </>
  );
}
