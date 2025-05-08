import { useState } from "react";
import axios from "axios";

export default function ConfirmEmail({ email, onClose, openLoginModal }) {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/confirm-email`, {
        email,
        confirmationCode,
      });
      if (res.data.message) {
        setSuccessMessage("Email confirmed successfully! Redirecting to login...");
        setTimeout(() => {
          setSuccessMessage("");
          onClose(); // Close the current modal
          openLoginModal(); // Open the login modal
        }, 2000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid confirmation code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/resend-confirmation-code`, {
        email,
      });
      if (res.data.message) {
        setResendTimer(60); // Reset timer
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to resend confirmation code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleConfirm} className="space-y-4">
        <p>A confirmation email has been sent to {email}. Please enter the code below to confirm your email.</p>
        <input
          type="text"
          placeholder="Enter Confirmation Code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          required
        />

        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
            disabled={loading}
          >
            {loading ? "Confirming..." : "Confirm Email"}
          </button>
          <button
            type="button"
            onClick={handleResendCode}
            className="text-blue-600 hover:underline"
            disabled={resendTimer > 0 || loading}
          >
            Resend Code {resendTimer > 0 && `(${resendTimer}s)`}
          </button>
        </div>
      </form>
    </div>
  );
}