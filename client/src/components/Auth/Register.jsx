import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Register({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, mobileNo, password } = formData;

    if (!email.includes("@")) {
      Swal.fire("Error", "Invalid email format", "error");
      return false;
    }
    if (mobileNo.length !== 11 || isNaN(mobileNo)) {
      Swal.fire("Error", "Mobile number must be exactly 11 digits", "error");
      return false;
    }
    if (password.length < 8) {
      Swal.fire("Error", "Password must be at least 8 characters long", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/register`, formData);
      if (res.data.success) {
        Swal.fire("Success!", "Registration successful!", "success");

        setTimeout(() => {
          onClose(); // Close the modal after successful registration
        }, 1000);
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
