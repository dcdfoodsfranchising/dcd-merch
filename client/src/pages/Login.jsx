import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../context/UserContext";

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
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
              // Store token and user info in localStorage
              localStorage.setItem("token", response.data.access);
              localStorage.setItem("user", JSON.stringify({ email })); // Store user email
  
              // Update UserContext
              login({ email });  // ✅ Set user state
  
              toast.success("Login successful finally!");
              setTimeout(() => navigate("/"), 1500);
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-md" required />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          Don't have an account?
          <button onClick={() => navigate("/register")} className="text-blue-600 ml-1 hover:underline">Sign up</button>
        </p>
      </div>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}