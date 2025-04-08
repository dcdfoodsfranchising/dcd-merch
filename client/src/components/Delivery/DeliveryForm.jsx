import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { saveDeliveryDetails } from "../../services/deliveryDetailsService"; // Your API service
import Swal from "sweetalert2"; // Optional for showing success/error alerts

const DeliveryForm = () => {
  const { user } = useContext(UserContext); // Get user info from context
  const navigate = useNavigate(); // For redirection after form submission

  // State for the delivery form
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "",
    phoneNumber: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions

    setLoading(true);

    try {
      const data = await saveDeliveryDetails(deliveryDetails, user.token);

      Swal.fire({
        icon: "success",
        title: "Delivery details saved successfully",
        text: "Your delivery information has been saved. Proceed to checkout.",
      });

      // Redirect to the checkout or confirmation page after saving the details
      navigate("/checkout"); // Adjust to your desired route
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Delivery Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={deliveryDetails.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={deliveryDetails.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={deliveryDetails.city}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={deliveryDetails.postalCode}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 mt-4 text-white bg-blue-500 rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Delivery Details"}
        </button>
      </form>
    </div>
  );
};

export default DeliveryForm;
