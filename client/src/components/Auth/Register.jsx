import { useState } from "react";
import axios from "axios";
import ConfirmEmail from "./ConfirmEmail";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Terms and Conditions Modal Component
function TermsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">Terms and Conditions & Privacy Policy</h2>
        <div className="max-h-72 overflow-y-auto text-sm text-gray-700 space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Terms and Conditions</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <b>Account Responsibility:</b> You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.
              </li>
              <li>
                <b>Order Acceptance:</b> We reserve the right to refuse or cancel any order for any reason, including errors in product or pricing information.
              </li>
              <li>
                <b>Prohibited Activities:</b> You agree not to use the site for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.
              </li>
              <li>
                <b>Changes to Terms:</b> We may update these terms at any time. Continued use of the site means you accept any changes.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Privacy Policy</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <b>Information Collection:</b> We collect personal information such as your name, email, address, and payment details to process your orders and improve your experience.
              </li>
              <li>
                <b>Use of Information:</b> Your information is used to fulfill orders, provide customer support, and send updates or promotional offers (you may opt out at any time).
              </li>
              <li>
                <b>Data Protection:</b> We implement security measures to protect your data and do not sell your personal information to third parties.
              </li>
              <li>
                <b>Cookies:</b> We use cookies to enhance your browsing experience and analyze site traffic.
              </li>
              <li>
                <b>Policy Updates:</b> Our privacy policy may change. Please review it periodically for updates.
              </li>
            </ul>
          </div>
          <p>
            Please read our full Terms and Conditions and Privacy Policy for more details.
          </p>
        </div>
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex justify-end mt-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Register({ onClose, openLoginModal }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    mobileNo: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, mobileNo, password, confirmPassword } = formData;

    if (!email.includes("@")) {
      toast.error("Invalid email format");
      return false;
    }
    if (mobileNo.length !== 11 || isNaN(mobileNo)) {
      toast.error("Mobile number must be exactly 11 digits");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!agreed) {
      toast.error("You must agree to the Terms and Conditions");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/register`, formData);
      if (res.data.success) {
        toast.success("Registration successful! Please confirm your email.");
        setIsConfirming(true);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
      {!isConfirming ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="mobileNo"
            placeholder="Mobile Number"
            value={formData.mobileNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            maxLength="11"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />

          {/* Terms and Conditions */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="accent-red-600"
            />
            <label htmlFor="agree" className="text-sm">
              I agree to the{" "}
              <button
                type="button"
                className="text-red-600 underline hover:text-red-700"
                onClick={() => setShowTerms(true)}
                tabIndex={0}
              >
                Terms and Conditions
              </button>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
            disabled={loading || !agreed}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      ) : (
        <ConfirmEmail
          email={formData.email}
          onClose={() => setIsConfirming(false)}
          openLoginModal={openLoginModal || (() => console.warn("openLoginModal is not defined"))}
        />
      )}
    </div>
  );
}