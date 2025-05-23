import React from 'react';

const OrderSummary = ({
  items = [],
  total,
  formData,
  onFormSave,
  onOrderSuccess,
  onOrderError,
  onContinueShopping,
}) => {
  // Compute total from items if not provided
  const computedTotal =
    items.length > 0
      ? '₱' +
        items
          .reduce(
            (sum, item) =>
              sum +
              (
                item.variant?.price ??
                item.product?.price ??
                item.price ??
                item.productId?.price ??
                0
              ) * item.quantity,
            0
          )
          .toLocaleString(undefined, { minimumFractionDigits: 2 })
      : total;

  // Handles complete purchase: save delivery details, then create order
  const handleCompletePurchase = async () => {
    try {
      if (onFormSave) {
        await onFormSave(); // Save delivery details
      }
      if (onOrderSuccess) {
        await onOrderSuccess(); // Create order and handle success
      }
    } catch (error) {
      if (onOrderError) onOrderError(error);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-xl text-slate-900 font-semibold mb-6">Order Summary</h2>
      <ul className="text-slate-500 font-medium space-y-4 mb-4">
        {items.length === 0 && (
          <li className="text-gray-400 text-sm">No items in cart.</li>
        )}
        {items.map((item, idx) => {
          console.log("OrderSummary item:", item);
          // For Buy Now, product info is in item.product or item.productId (populated)
          const product = item.product || item.productId || item;
          const price =
            item.variant?.price ??
            item.product?.price ??
            item.price ??
            0;
          return (
            <div key={idx} className="flex items-center mb-3">
              <img
                src={product.images?.[0] || item.images?.[0]}
                alt={product.name || item.name}
                className="w-14 h-14 object-contain rounded mr-3"
              />
              <div className="flex-1">
                <div className="font-medium">{product.name || item.name}</div>
                <div className="text-xs text-gray-500">
                  {item.color && <span>{item.color} </span>}
                  {item.size && <span>{item.size}</span>}
                </div>
                <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
              </div>
              <div className="text-sm text-gray-700 font-semibold min-w-[80px] text-right">
                ₱{Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          );
        })}
      </ul>
      <hr className="my-4 border-slate-300" />
      <ul className="text-slate-500 font-medium space-y-4">
        <li className="flex flex-wrap gap-4 text-[15px] font-semibold text-slate-900">
          Total <span className="ml-auto">{computedTotal}</span>
        </li>
      </ul>
      <div className="space-y-4 mt-8">
        <button
          type="button"
          className="rounded-md px-4 py-2.5 w-full text-sm font-medium tracking-wide bg-red-700 hover:bg-red-800 text-white cursor-pointer"
          onClick={handleCompletePurchase}
        >
          Complete Purchase
        </button>
        <button
          type="button"
          className="rounded-md px-4 py-2.5 w-full text-sm font-medium tracking-wide bg-gray-100 hover:bg-gray-200 border border-gray-300 text-slate-900 cursor-pointer"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;