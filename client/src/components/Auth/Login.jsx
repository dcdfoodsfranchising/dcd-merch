import { useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function Login({ onClose }) {
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!executeRecaptcha) {
      toast.error("reCAPTCHA is not ready. Please try again later.");
      setLoading(false);
      return;
    }
  
    try {
      // Execute reCAPTCHA v3 and get the token
      const captchaToken = await executeRecaptcha("login");
  
      const requestPayload = { email, password, captchaToken };
  
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/login`,
        requestPayload,
        { headers: { "Content-Type": "application/json" } }
      );
  
  
      if (response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        await retrieveUserDetails(response.data.accessToken);
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Login Error Response:", error.response?.data);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again later.";
  
      // Handle specific error messages
      if (error.response?.status === 403) {
        toast.error("Please confirm your email before logging in.");
      } else if (error.response?.status === 400) {
        toast.error("CAPTCHA verification failed. Please try again.");
      } else if (error.response?.status === 401) {
        toast.error("Invalid email or password.");
      } else {
        toast.error(errorMessage);
      }
  
      setLoading(false);
    }
  };

  const retrieveUserDetails = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/users/details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(token)

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