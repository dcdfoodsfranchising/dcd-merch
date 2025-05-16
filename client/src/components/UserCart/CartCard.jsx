import React from "react";
import { Minus, Plus, Trash } from "lucide-react";

export default function CartCard({ item, loading, onDecrease, onIncrease, onRemove }) {
  const imageUrl = item.productId.images?.[0];
  const price = item.variant?.price ?? item.productId.price;
  const variant = item.variant?.name || item.variant?.variant || null;
  const size = item.variant?.size || null;
  const color = item.variant?.color || null;

  return (
    <div className="flex w-full gap-4 bg-white px-4 py-6 rounded-md shadow-sm items-center">
      <div className="flex gap-6 sm:gap-4 max-sm:flex-col w-full">
        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={item.productId.name}
            className="w-full h-full object-contain rounded"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col gap-2 justify-between flex-1">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate">{item.productId.name}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {variant && (
                <span className="text-xs text-slate-500 border border-slate-200 rounded px-1 py-0.5">
                  {variant}
                </span>
              )}
              {size && (
                <span className="text-xs text-slate-500 border border-slate-200 rounded px-1 py-0.5">
                  Size: {size}
                </span>
              )}
              {color && (
                <span className="flex items-center text-xs text-slate-500 gap-1">
                  Color:
                  <span
                    className="inline-block w-4 h-4 rounded-sm border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-900">
              ₱{Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
      <div className="ml-auto flex flex-col h-full items-end justify-between">
        <span className="text-gray-700 font-semibold text-base mb-2">
          ₱{Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={item.quantity === 1 ? onRemove : onDecrease}
            className={`flex items-center justify-center w-[22px] h-[22px] rounded-full transition-colors
              ${item.quantity === 1
                ? "bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"}
            `}
            disabled={loading}
            aria-label={item.quantity === 1 ? "Remove" : "Decrease"}
          >
            {item.quantity === 1 ? <Trash size={14} /> : <Minus size={14} />}
          </button>
          <span className="font-semibold text-base leading-[18px]">{item.quantity}</span>
          <button
            onClick={onIncrease}
            className="flex items-center justify-center w-[22px] h-[22px] rounded-full bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            disabled={loading}
            aria-label="Increase"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}