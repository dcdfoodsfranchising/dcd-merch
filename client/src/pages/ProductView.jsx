import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductView = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
        const data = await response.json();
        setProduct(data.product);
        setSelectedImage(data.product?.images?.[0] || null);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p className="text-center mt-5">Loading product details...</p>;
  }

  return (
    <div className="p-4">
      <div className="lg:max-w-6xl max-w-xl mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-12 max-sm:gap-8">
          {/* Image Section */}
          <div className="w-full lg:sticky top-0">
            <div className="flex flex-col gap-4">
              {/* Large Image Display */}
              <div className="flex-1">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full aspect-[548/712] object-cover rounded shadow"
                />
              </div>

              {/* Thumbnails Carousel on Mobile */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-24 object-cover cursor-pointer border-2 ${
                      selectedImage === img ? 'border-black' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{product.name}</h3>
              <p className="text-slate-500 mt-2 text-sm">{product.description}</p>

              <div className="flex items-center flex-wrap gap-4 mt-6">
                <h4 className="text-slate-900 text-2xl sm:text-3xl font-semibold">₱{product.price}</h4>
                <p className="text-slate-500 text-lg">
                  <span className="text-sm ml-1.5">Tax included</span>
                </p>
              </div>

              <p className="text-slate-500 text-sm mt-2">Available Quantity: {product.quantity}</p>

              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="px-4 py-3 w-[45%] border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-medium"
                >
                  Add to wishlist
                </button>
                <button
                  type="button"
                  className={`px-4 py-3 w-[45%] text-sm font-medium ${
                    product.quantity > 0
                      ? 'border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white'
                      : 'border border-slate-400 bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={product.quantity === 0}
                >
                  {product.quantity > 0 ? 'Add to cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

            <hr className="my-6 border-slate-300" />

            {/* Description */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Product Information</h3>
              <div className="mt-4">
                <p className="text-sm text-slate-500 leading-relaxed">
                  {product.description || 'No additional product information available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
