import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function ProtectedRoute({ component: Component }) {
  const { user } = useContext(UserContext);

  // ✅ Allow access to admins only
  return user?.isAdmin ? <Component /> : <Navigate to="/" />;
}
