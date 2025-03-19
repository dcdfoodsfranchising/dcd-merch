import { useState, useContext } from "react";
import  UserContext  from "../context/UserContext";

export default function useNavbarLogic() {
  const { user } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);
  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return {
    user,
    isAdmin: user?.isAdmin || false,
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
  };
}
