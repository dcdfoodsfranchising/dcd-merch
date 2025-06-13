import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import useNavbarLogic from "../../hooks/useNavbarLogic";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";
import ProfileModal from "../Auth/ProfileModal";
import LogoutModal from "../Auth/LogoutModal";
import CartModal from "../UserCart/CartModal";
import { FaShoppingCart, FaUserCircle, FaChevronDown } from "react-icons/fa";

export default function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileClick = () => {
    if (user?.id) {
      if (profileDropdownOpen) {
        toggleProfileDropdown(false);
      } else {
        toggleProfileDropdown(true);
      }
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleCloseDropdown = () => {
    toggleProfileDropdown(false);
  };

  // Dynamic navbar style
  const navClass = `fixed w-full top-0 left-0 z-50 transition-colors duration-500
    ${isHome && !scrolled ? "bg-transparent" : "bg-white shadow-lg border-b border-slate-200"}`;

  // Icon color based on background
  const iconColor = isHome && !scrolled ? "#e5e7eb" : "#1f2937"; // softer gray when on hero

  return (
    <>
      <nav className={navClass} >
        <div className="flex justify-between items-center px-4 py-4 lg:py-8 max-w-6xl mx-auto relative">
          {/* Centered Logo */}
          <div className="flex-shrink-0 flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img
                src={
                  isHome && !scrolled
                    ? "/assets/logo/logo-white.png"
                    : "/assets/logo/logo.png"
                }
                alt="Logo"
                className="w-32 md:w-36 lg:w-48 transition-all duration-300"
              />
            </Link>
          </div>

          {/* Right side: Cart, Profile, and Hamburger */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            {/* Hide these on mobile */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart Icon */}
              <button
                onClick={() => setCartModalOpen(true)}
                className="flex items-center space-x-2"
                aria-label="Cart"
              >
                <FaShoppingCart size={32} color={iconColor} />
              </button>
              {/* Profile Icon */}
              <button
                onClick={handleProfileClick}
                className="relative flex items-center space-x-2"
                aria-label="Profile"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border"
                    style={{ borderColor: iconColor }}
                  />
                ) : (
                  <FaUserCircle size={32} color={iconColor} />
                )}
                {user?.id && (
                  <span
                    className={`absolute -bottom-1 -right-2 flex items-center justify-center transition-transform duration-200 ${
                      profileDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <FaChevronDown size={20} color={iconColor} />
                  </span>
                )}
              </button>
            </div>
            {/* Hamburger menu or Profile icon on mobile */}
            {!user?.id ? (
              // Show profile icon if not logged in
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 focus:outline-none"
                onClick={() => setLoginModalOpen(true)}
                aria-label="Open login"
              >
                <FaUserCircle size={32} color={iconColor} />
              </button>
            ) : (
              // Show burger menu if logged in
              <button
                className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
                onClick={toggleMenu}
                aria-label="Open menu"
              >
                <span
                  className="block w-7 h-0.5 rounded bg-current mb-2 transition-all duration-300"
                  style={{ backgroundColor: iconColor }}
                />
                <span
                  className="block w-7 h-0.5 rounded bg-current transition-all duration-300"
                  style={{ backgroundColor: iconColor }}
                />
              </button>
            )}
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
          isLoggedIn={!!user?.id}
          onLoginRedirect={() => setLoginModalOpen(true)}
        />
      )}

      {/* Login Modal */}
      {!user?.id && loginModalOpen && (
        <ProfileModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      )}

      {/* Modals */}
      {profileModalOpen && <ProfileModal isOpen={profileModalOpen} onClose={closeProfileModal} />}
      {logoutModalOpen && <LogoutModal isOpen={logoutModalOpen} onClose={closeLogoutModal} onConfirm={logout} />}
      <CartModal isOpen={cartModalOpen} onClose={() => setCartModalOpen(false)} />
    </>
  );
}