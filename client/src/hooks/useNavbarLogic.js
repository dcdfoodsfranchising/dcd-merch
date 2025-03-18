import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function useNavbarLogic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user, unsetUser } = useContext(UserContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);
  const openProfileModal = () => setProfileModalOpen(true);
  const closeProfileModal = () => setProfileModalOpen(false);
  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);

  const logout = () => {
    unsetUser();
    setLogoutModalOpen(false);
    navigate("/");
  };

  return {
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
  };
}
