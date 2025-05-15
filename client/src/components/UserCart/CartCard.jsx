import React from "react";
import { Minus, Plus, Trash } from "lucide-react";

export default function CartCard({ item, loading, onDecrease, onIncrease, onRemove }) {
  const imageUrl = item.productId.images?.[0];
  const price = item.variant?.price ?? item.productId.price;

  return (
    <div className="flex items-center justify-between mb-4 border-b pb-2">
      <div className="flex items-center gap-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.productId.name}
            className="w-16 h-16 object-cover rounded border"
            loading="lazy"
          />
        )}
        <div>
          <h3 className="font-medium">{item.productId.name}</h3>
          <p className="text-sm text-gray-500">
            ₱{Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x {item.quantity}
          </p>
          <p className="text-gray-700 font-semibold">
            Total: ₱{Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>
      <div className="flex items-center">
        <button
          onClick={onDecrease}
          className="bg-gray-300 px-2 py-1 rounded-md hover:bg-gray-400"
          disabled={loading || item.quantity <= 1}
        >
          <Minus size={16} />
        </button>
        <span className="mx-2">{item.quantity}</span>
        <button
          onClick={onIncrease}
          className="bg-gray-300 px-2 py-1 rounded-md hover:bg-gray-400"
          disabled={loading}
        >
          <Plus size={16} />
        </button>
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 ml-4"
          disabled={loading}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}