import React from 'react';

const CartItem = ({ item }) => {
  return (
    <div className="flex justify-between items-center p-2 border rounded">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-500">x{item.quantity}</p>
      </div>
      <div className="font-semibold">₱{item.subtotal.toFixed(2)}</div>
    </div>
  );
};

export default CartItem;
