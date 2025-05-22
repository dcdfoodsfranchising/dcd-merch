import React from 'react';

const OrderSummary = ({ items = [], total }) => {
  // Compute total from items if not provided
  const computedTotal =
    items.length > 0
      ? '₱' +
        items
          .reduce(
            (sum, item) =>
              sum +
              ((item.variant?.price ?? item.productId?.price ?? 0) * item.quantity),
            0
          )
          .toLocaleString(undefined, { minimumFractionDigits: 2 })
      : total;

  return (
    <div className="relative">
      <h2 className="text-xl text-slate-900 font-semibold mb-6">Order Summary</h2>
      <ul className="text-slate-500 font-medium space-y-4 mb-4">
        {items.length === 0 && (
          <li className="text-gray-400 text-sm">No items in cart.</li>
        )}
        {items.map((item) => {
          const image =
            (item.productId?.images && item.productId.images[0]) ||
            (item.images && item.images[0]) ||
            item.productId?.image ||
            item.image;

          return (
            <li key={item._id || item.id} className="flex justify-between items-center text-sm pb-3">
              <div className="flex items-center gap-3">
                {image ? (
                  <img
                    src={image}
                    alt={item.productId?.name || item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
                <div>
                  <div>
                    {item.productId?.name || item.name}
                    {item.variant?.name && (
                      <span className="text-xs text-gray-500"> ({item.variant.name})</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">x{item.quantity}</div>
                </div>
              </div>
              <span className="font-semibold text-slate-900 ml-4">
                ₱
                {Number(
                  (item.variant?.price ?? item.productId?.price ?? 0) * item.quantity
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </li>
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
          className="rounded px-4 py-2.5 w-full text-sm font-medium tracking-wide bg-red-700 hover:bg-red-800 text-white cursor-pointer"
          style={{ minWidth: 192, fontSize: '1rem' }}
        >
          Complete Purchase
        </button>
        <button
          type="button"
          className="rounded px-4 py-2.5 w-full text-sm font-medium tracking-wide bg-white border border-red-700 text-red-700 hover:bg-red-50 cursor-pointer"
          style={{ minWidth: 192, fontSize: '1rem' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;