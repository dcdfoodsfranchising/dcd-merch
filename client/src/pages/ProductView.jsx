import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductView = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [priceRange, setPriceRange] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
        const data = await response.json();
        setProduct(data.product);
        setSelectedImage(data.product?.images?.[0] || null);
        setSelectedVariant(data.product?.variants?.[0] || null); // Default to the first variant

        // Calculate price range
        if (data.product?.variants?.length > 0) {
          const prices = data.product.variants.map((variant) => variant.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange({ min: minPrice, max: maxPrice });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProduct();
  }, [productId]);

  const calculateAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / product.reviews.length).toFixed(1);
  };

  if (!product) {
    return <p className="text-center mt-5">Loading product details...</p>;
  }

  const averageRating = calculateAverageRating();

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

              {/* Thumbnails Side by Side */}
              <div className="flex gap-3 overflow-x-auto">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setSelectedImage(img)}
                    className={`w-24 h-24 object-cover cursor-pointer border-2 rounded ${
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

              {/* Reviews, Number of Reviews, and Sold */}
              <div className="flex items-center gap-4 mt-2">
                {/* Stars for Average Rating */}
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={`text-yellow-500 ${
                        index < Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-500">
                  {product.reviews?.length || 0} reviews
                </p>
                <p className="text-sm text-slate-500">{product.sold || 0} sold</p>
              </div>

              <div className="flex items-center flex-wrap gap-4 mt-6">
                <h4 className="text-slate-900 text-2xl sm:text-3xl font-semibold">
                  {selectedVariant
                    ? `₱${selectedVariant.price}`
                    : priceRange
                    ? `₱${priceRange.min} - ₱${priceRange.max}`
                    : `₱${product.price}`}
                </h4>
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
                      ? 'border border-red-600 bg-red-600 hover:bg-red-700 text-white'
                      : 'border border-slate-400 bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={product.quantity === 0}
                >
                  {product.quantity > 0 ? 'Add to cart' : 'Out of Stock'}
                </button>
              </div>
            </div>

            <hr className="my-6 border-slate-300" />

            {/* Variants Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Variants</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((variant, index) => (
                    <button
                      key={index}
                      className={`px-4 py-2 text-sm font-medium border rounded ${
                        selectedVariant?.name === variant.name
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.name}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No variants available for this product.</p>
                )}
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

            <hr className="my-6 border-slate-300" />

            {/* Reviews Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Product Reviews</h3>
              <div className="mt-4 space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="border rounded p-4 shadow-sm">
                      <p className="text-sm text-slate-900 font-medium">{review.user}</p>
                      <p className="text-sm text-slate-500 mt-1">{review.comment}</p>
                      <p className="text-sm text-yellow-500 mt-1">Rating: {review.rating} / 5</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No reviews available for this product.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;