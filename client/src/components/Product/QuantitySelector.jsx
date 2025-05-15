import React from "react";

const QuantitySelector = ({ quantity, setQuantity, max, onQuantityChange }) => (
  <div className="flex items-center gap-2 mt-4 mb-2">
    <label htmlFor="quantity" className="text-sm font-medium text-slate-700">
      Quantity
    </label>
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center px-0 border rounded text-lg font-bold"
      onClick={() => {
        if (quantity > 1) {
          setQuantity(quantity - 1);
          if (onQuantityChange) onQuantityChange(-1);
        }
      }}
      disabled={quantity <= 1}
      aria-label="Decrease quantity"
    >
      -
    </button>
    <input
      id="quantity"
      type="text"
      min={1}
      max={max}
      value={quantity}
      readOnly
      className="w-14 h-10 text-center border rounded bg-gray-100"
      aria-label="Quantity"
    />
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center px-0 border rounded text-lg font-bold"
      onClick={() => {
        if (quantity < max) {
          setQuantity(quantity + 1);
          if (onQuantityChange) onQuantityChange(1);
        }
      }}
      disabled={quantity >= max}
      aria-label="Increase quantity"
    >
      +
    </button>
    <span className="text-xs text-slate-500 ml-2">(Max: {max})</span>
  </div>
);

export default QuantitySelector;