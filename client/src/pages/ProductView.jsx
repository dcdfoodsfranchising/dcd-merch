import { useState } from "react";

export default function ProductView({ product }) {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState("");

  return (
    <div className="p-4">
      <div className="lg:max-w-6xl max-w-xl mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IMAGE VIEW */}
          <div className="w-full lg:sticky top-0">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-16">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Product ${index}`}
                    className={`aspect-[64/85] object-cover cursor-pointer border-b-2 ${
                      mainImage === img ? "border-black" : "border-transparent"
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
              <div className="flex-1">
                <img src={mainImage} alt="Main Product" className="w-full aspect-[548/712] object-cover" />
              </div>
            </div>
          </div>

          {/* PRODUCT INFO */}
          <div className="w-full">
            <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
            <p className="text-slate-500 mt-2">{product.description}</p>

            <div className="flex items-center gap-4 mt-6">
              <h4 className="text-3xl font-semibold text-slate-900">${product.price}</h4>
              {product.originalPrice && (
                <p className="text-lg text-slate-500">
                  <strike>${product.originalPrice}</strike>
                  <span className="text-sm ml-2">Tax included</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-sm">
                <p>{product.rating}</p>
                <svg className="w-4 h-4 fill-white ml-1" viewBox="0 0 14 13">
                  <path d="M7 0L9.47 3.6 13.66 4.84 10.99 8.3 11.11 12.66 7 11.2 2.89 12.66 3 8.3.34 4.84 4.53 3.6 7 0Z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500">{product.reviewsCount} reviews</p>
            </div>

            {/* SIZES */}
            {product.sizes && (
              <>
                <h3 className="text-lg font-semibold mt-6">Sizes</h3>
                <div className="flex gap-3 mt-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`w-10 h-9 border text-sm ${
                        selectedSize === size
                          ? "border-blue-600"
                          : "border-slate-300 hover:border-blue-600"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex gap-4">
              <button className="w-1/2 px-4 py-3 bg-slate-100 hover:bg-slate-200 border text-sm font-medium">
                Add to Wishlist
              </button>
              <button className="w-1/2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium">
                Add to Cart
              </button>
            </div>

            {/* DELIVERY PIN */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Select Delivery Location</h3>
              <p className="text-sm text-slate-500 mt-1">
                Enter the pincode of your area to check product availability.
              </p>
              <div className="flex gap-2 mt-4 max-w-sm">
                <input
                  type="number"
                  placeholder="Enter pincode"
                  className="bg-slate-100 px-4 py-2.5 text-sm w-full outline-none"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm">
                  Apply
                </button>
              </div>
            </div>

            {/* PRODUCT INFO ACCORDION */}
            <div className="mt-8">
              <Accordion title="Product details" content={product.details} />
              <Accordion title="Vendor details" content={product.vendor} />
              <Accordion title="Return and exchange policy" content={product.returnPolicy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ title, content }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        className="w-full py-3 text-left text-sm font-semibold flex items-center"
        onClick={() => setOpen(!open)}
      >
        {title}
        <svg
          className={`ml-auto w-4 h-4 transform transition-transform ${
            open ? "rotate-180" : "rotate-90"
          }`}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 18.17a2.38 2.38 0 0 1-1.68-.7l-9.52-9.52a2.38 2.38 0 1 1 3.36-3.36l7.84 7.84 7.84-7.84a2.38 2.38 0 1 1 3.36 3.36l-9.52 9.52a2.38 2.38 0 0 1-1.68.7z"
            fill="currentColor"
          />
        </svg>
      </button>
      {open && <div className="pb-4 text-sm text-slate-500">{content}</div>}
    </div>
  );
}
