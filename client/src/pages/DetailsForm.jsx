import React, { useEffect, useState, useCallback } from 'react';
import { getOwnDeliveryDetails, saveDeliveryDetails } from '../services/deliveryDetailsService';
import { getCartItems } from '../services/cartService';
import DeliveryForm from '../components/Delivery/DeliveryForm';
import OrderSummary from '../components/Delivery/OrderSummary';
import { useNavigate } from 'react-router-dom';
import NavbarLogo from '../components/NavbarLogo';
import { createOrder, createDirectOrder } from '../services/orderService'; // Update import
import Lottie from 'lottie-react';
import successAnim from '../assets/icons/success.json';
import { getProductById } from '../services/productService';

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
  const [formErrors, setFormErrors] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState('₱0.00');
  const [showSuccess, setShowSuccess] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState(null);
  const navigate = useNavigate();

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

  // Fetch cart items and total, and ensure product price is available for Buy Now
  useEffect(() => {
    const buyNowDetails = localStorage.getItem('buyNowDetails');
    if (buyNowDetails) {
      const parsed = JSON.parse(buyNowDetails);

      // If price is present (from order history), use it directly
      if (parsed.price) {
        const itemWithProduct = {
          ...parsed,
          // fallback for name/images if not present
          name: parsed.name,
          images: parsed.images,
        };
        setBuyNowItem(itemWithProduct);
        setCartItems([itemWithProduct]);
        setCartTotal(
          parsed.price
            ? `₱${Number(parsed.price * parsed.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : '₱0.00'
        );
        return;
      }

      // Otherwise, fetch latest product info (for Buy Now from product page)
      getProductById(parsed.productId).then(product => {
        let price = product.price;
        if (product.variants && product.variants.length > 0) {
          const variant = product.variants.find(
            v => v.color === parsed.color && v.size === parsed.size
          );
          price = variant?.price ?? product.price;
        }
        const itemWithProduct = {
          ...parsed,
          product: { ...product, price },
          price,
          name: product.name,
          images: product.images,
          quantity: parsed.quantity,
          color: parsed.color,
          size: parsed.size,
        };
        setBuyNowItem(itemWithProduct);
        setCartItems([itemWithProduct]);
        setCartTotal(
          price
            ? `₱${Number(price * parsed.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
            : '₱0.00'
        );
      });
    } else {
      // Fallback to cart items
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
    }
  }, []);

  const validateForm = (data) => {
    const errors = {};
    if (!data.firstName) errors.firstName = 'This field is required';
    if (!data.lastName) errors.lastName = 'This field is required';
    if (!data.contactNumber) errors.contactNumber = 'This field is required';
    if (!data.barangay) errors.barangay = 'This field is required';
    if (!data.city) errors.city = 'This field is required';
    if (!data.postalCode) errors.postalCode = 'This field is required';
    if (!data.completeAddress) errors.completeAddress = 'This field is required';
    return errors;
  };

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setFormErrors(prev => ({
      ...prev,
      [e.target.name]: ''
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      await saveDeliveryDetails(formData);
      // Optionally show a local message or animation here
    } catch (error) {
      // Optionally handle API error
    }
  }, [formData]);

  const handleFormSave = async () => {
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return false;
    await saveDeliveryDetails(formData);
    return true;
  };

  const handleOrderSuccess = async () => {
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (buyNowItem) {
      // Buy Now flow
      const payload = {
        productId: buyNowItem.productId,
        quantity: buyNowItem.quantity,
        deliveryDetails: formData
      };
      if (buyNowItem.color && buyNowItem.color !== "") payload.color = buyNowItem.color;
      if (buyNowItem.size && buyNowItem.size !== "") payload.size = buyNowItem.size;

      console.log("Payload sent to /orders/buy-now:", payload); // <--- Add this line

      await createDirectOrder(payload);
      localStorage.removeItem('buyNowDetails');
    } else {
      // Cart checkout flow
      await createOrder(formData);
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/order-confirmation');
    }, 1800);
  };

  const handleOrderError = (error) => {
    // Optionally handle API error
  };

  // Handler for Continue Shopping button
  const handleContinueShopping = () => {
    navigate('/');
  };

  return (
    <div className="bg-white sm:px-8 px-4 py-6 min-h-[100vh] overflow-y-auto">
      {/* Success Lottie Animation Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-40">
          <Lottie animationData={successAnim} style={{ width: 180, height: 180 }} loop={false} />
          <div className="text-xl font-semibold text-green-700 mt-4">Order placed successfully!</div>
        </div>
      )}
      {/* Logo Navbar */}
      <NavbarLogo />
      <div className="max-w-screen-xl max-md:max-w-xl mx-auto">
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-12">
          {/* Delivery Details Form Section */}
          <div className="lg:col-span-2">
            <DeliveryForm
              formData={formData}
              setFormData={setFormData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              formErrors={formErrors}
            />
          </div>
          {/* Order Summary Section */}
          <div className="relative">
            <OrderSummary
              items={cartItems}
              total={cartTotal}
              formData={formData}
              onFormSave={handleFormSave}
              onOrderSuccess={handleOrderSuccess}
              onOrderError={handleOrderError}
              onContinueShopping={handleContinueShopping}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
