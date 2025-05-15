import React from "react";

export default function ProductVariants({
  product,
  sizeOptions,
  colorOptions,
  onlyOneSizeAndColor,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
}) {
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Variants</h3>
      {product.variants && product.variants.length > 0 ? (
        <>
          {sizeOptions.length > 0 && (
            <div className="mt-4 flex items-center">
              <p className="text-sm font-medium mb-2 text-slate-700 mr-4">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size, index) => {
                  const isDisabled =
                    onlyOneSizeAndColor ||
                    (selectedColor &&
                      !product.variants.some(
                        (v) => v.size === size && v.color === selectedColor
                      ));
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={index}
                      className={`px-4 py-2 text-sm font-medium border rounded ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-600'
                          : isDisabled
                          ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedSize(isSelected ? null : size);
                        }
                      }}
                      disabled={isDisabled}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {colorOptions.length > 0 && (
            <div className="mt-4 flex items-center">
              <p className="text-sm font-medium mb-2 text-slate-700 mr-4">Color</p>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color, index) => {
                  const isDisabled =
                    onlyOneSizeAndColor ||
                    (selectedSize &&
                      !product.variants.some(
                        (v) => v.color === color && v.size === selectedSize
                      ));
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={index}
                      className={`px-4 py-2 text-sm font-medium border rounded ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-600'
                          : isDisabled
                          ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          setSelectedColor(isSelected ? null : color);
                        }
                      }}
                      disabled={isDisabled}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-slate-500 mt-4">No variants available for this product.</p>
      )}
    </div>
  );
}