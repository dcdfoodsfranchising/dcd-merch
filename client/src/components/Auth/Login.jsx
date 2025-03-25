import { useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function Login({ onClose }) {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("🔑 API Login Response:", response.data);

      if (response.data.access) {
        localStorage.setItem("token", response.data.access);
        await retrieveUserDetails(response.data.access);
      } else {
        toast.error("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Login Error:", error);
      toast.error("Invalid credentials. Try again.");
      setLoading(false);
    }
  };

  const retrieveUserDetails = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userData = response.data.user;
      setUser({ id: userData._id, isAdmin: userData.isAdmin });

      localStorage.setItem(
        "user",
        JSON.stringify({ id: userData._id, isAdmin: userData.isAdmin })
      );

      toast.success("Login successful!");

      // **Redirect based on role**
      setTimeout(() => {
        onClose();
        if (userData.isAdmin) {
          navigate("/dashboard"); // ✅ Redirect admin users to Dashboard
        } else {
          navigate("/"); // ✅ Redirect non-admin users to Home
        }
      }, 1000);
    } catch (error) {
      console.error("❌ Error retrieving user details:", error);
      toast.error("Failed to retrieve user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          disabled={loading || email === "" || password === ""}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}
