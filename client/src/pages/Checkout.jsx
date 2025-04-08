import React from 'react';
import CheckoutSteps from '../components/Progress/CheckoutSteps';

const CheckoutPage = () => {
  const address = localStorage.getItem('deliveryAddress');

  const handleCheckout = () => {
    // Replace with your cartService.checkout() logic
    alert('Order placed successfully!');
    localStorage.removeItem('deliveryAddress');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <CheckoutSteps step={3} />
      <h2 className="text-xl font-bold mb-4">Review Order</h2>
      <p className="mb-4">
        <strong>Deliver to:</strong><br />
        {address}
      </p>
      <button onClick={handleCheckout} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded">
        Confirm & Checkout
      </button>
    </div>
  );
};

export default CheckoutPage;
