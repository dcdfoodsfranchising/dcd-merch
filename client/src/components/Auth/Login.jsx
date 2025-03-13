import { useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../../context/UserContext";

export default function Login({ onClose }) {
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/login`,
        { email, password }
      );

      if (response.data.access) {
        localStorage.setItem("token", response.data.access);
        localStorage.setItem("user", JSON.stringify({ email }));

        login({ email });

        toast.success("Login successful!");
        setTimeout(() => {
          onClose(); // Close modal after login
        }, 1000);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Invalid credentials. Try again.");
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
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}
