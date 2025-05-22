import React, { useEffect, useState, useCallback } from 'react';
import { getOwnDeliveryDetails, saveDeliveryDetails } from '../services/deliveryDetailsService';
import { getCartItems } from '../services/cartService';
import Swal from 'sweetalert2';
import DeliveryForm from '../components/Delivery/DeliveryForm';
import OrderSummary from '../components/Delivery/OrderSummary';
import { useNavigate } from 'react-router-dom';
import NavbarLogo from '../components/NavbarLogo';
import ProgressBar from '../components/ProgressBar';

const initialForm = {
  firstName: '',
  lastName: '',
  contactNumber: '',
  barangay: '',
  city: '',
  postalCode: '',
  completeAddress: '',
  tag: '',
  notesForRider: '',
};

const DeliveryDetails = () => {
  const [formData, setFormData] = useState(initialForm);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState('₱0.00');
  const navigate = useNavigate(); // <-- Add this

  // Auto-fill form with saved address if available
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getOwnDeliveryDetails();
        if (response) setFormData(response);
      } catch (error) {
        // No saved address, keep form empty
      }
    };
    fetchDetails();
  }, []);

  // Fetch cart items and total
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartItems();
        if (data?.cart && Array.isArray(data.cart.cartItems)) {
          setCartItems(data.cart.cartItems);
          setCartTotal(
            data.cart.totalPrice !== undefined
              ? `₱${Number(data.cart.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : '₱0.00'
          );
        } else {
          setCartItems([]);
          setCartTotal('₱0.00');
        }
      } catch {
        setCartItems([]);
        setCartTotal('₱0.00');
      }
    };
    fetchCart();
  }, []);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await saveDeliveryDetails(formData);
      Swal.fire('Success!', 'Delivery details saved successfully!', 'success');
      // Proceed to payment or next step here
    } catch (error) {
      Swal.fire('Error', error.message || 'Something went wrong', 'error');
    }
  }, [formData]);

  // Handler for Continue Shopping button
  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="bg-white sm:px-8 px-4 py-6 min-h-[100vh] overflow-y-auto">
      {/* Logo Navbar */}
      <NavbarLogo />
      <div className="max-w-screen-xl max-md:max-w-xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar currentStep={2} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-12">
          {/* Delivery Details Form Section */}
          <div className="lg:col-span-2">
            <DeliveryForm
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
          {/* Order Summary Section */}
          <div className="relative">
            <OrderSummary
              items={cartItems}
              total={cartTotal}
              onContinueShopping={handleContinueShopping}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
