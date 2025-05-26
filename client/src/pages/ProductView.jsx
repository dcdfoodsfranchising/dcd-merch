import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCart } from '../services/cartService';
import { toast } from 'react-toastify';
import Lottie from 'lottie-react';
import successAnimation from '../assets/icons/success.json';
import QuantitySelector from '../components/Product/QuantitySelector';
import { updateProductQuantity } from '../services/productService';
import { createDirectOrder } from '../services/orderService'; // Add this import

// Lazy load subcomponents
const ProductImages = lazy(() => import('../components/Product/ProductImages'));
const ProductVariants = lazy(() => import('../components/Product/ProductVariants'));
const ProductReviews = lazy(() => import('../components/Product/ProductReviews'));

const ProductView = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [priceRange, setPriceRange] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`);
        const data = await response.json();
        setProduct(data.product);
        setSelectedImage(data.product?.images?.[0] || null);

        // Variant auto-selection logic
        if (data.product?.variants?.length === 1) {
          const v = data.product.variants[0];
          setSelectedVariant(v);
          setSelectedColor(v.color || null);
          setSelectedSize(v.size || null);
        } else if (data.product?.variants?.length > 1) {
          const sizes = [...new Set(data.product.variants.map((v) => v.size).filter(Boolean))];
          const colors = [...new Set(data.product.variants.map((v) => v.color).filter(Boolean))];
          if (sizes.length === 1 && colors.length === 1) {
            setSelectedSize(sizes[0]);
            setSelectedColor(colors[0]);
            const variant = data.product.variants.find(
              (v) => v.size === sizes[0] && v.color === colors[0]
            );
            setSelectedVariant(variant || null);
          } else {
            setSelectedVariant(null);
            setSelectedColor(null);
            setSelectedSize(null);
          }
        } else {
          setSelectedVariant(null);
          setSelectedColor(null);
          setSelectedSize(null);
        }

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

  // Update selectedVariant when color or size changes
  useEffect(() => {
    if (!product?.variants) return;
    if (product.variants.length === 1) return;
    const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
    const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
    if (sizes.length === 1 && colors.length === 1) return;

    if (selectedColor && selectedSize) {
      const variant = product.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColor, selectedSize, product]);

  const calculateAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0;
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / product.reviews.length).toFixed(1);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please login or register first to add items to your cart.');
      return;
    }
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.info('Please select a valid variant (size/color) before adding to cart.');
      return;
    }
    try {
      const productId = product._id;
      const size = selectedVariant ? selectedVariant.size : null;
      const color = selectedVariant ? selectedVariant.color : null;
      const quantityToAdd = quantity;
      await addToCart(productId, size, color, quantityToAdd);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 1800);
    } catch (error) {
      if (
        error.response &&
        (error.response.data?.message?.toLowerCase().includes('invalid token') ||
          error.response.data?.message?.toLowerCase().includes('jwt'))
      ) {
        toast.info('Session expired. Please login again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to cart.');
      }
    }
  };

  const handleQuantityChange = async (change) => {
    try {
      await updateProductQuantity(product._id, {
        size: selectedVariant?.size,
        color: selectedVariant?.color,
        quantityChange: change,
      });
      // Optionally, you can refetch product data here to update availableQuantity
    } catch (error) {
      toast.error("Failed to update product quantity.");
    }
  };

  // Add this handler for Buy Now
  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please login or register first to buy now.');
      return;
    }
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.info('Please select a valid variant (size/color) before buying.');
      return;
    }
    try {
      // Save buy now details to localStorage or state for /delivery page
      const buyNowDetails = {
        productId: product._id,
        color: selectedVariant ? selectedVariant.color : null,
        size: selectedVariant ? selectedVariant.size : null,
        quantity,
        product // Optionally pass product info for summary
      };
      localStorage.setItem('buyNowDetails', JSON.stringify(buyNowDetails));
      navigate('/delivery?mode=buy-now');
    } catch (error) {
      toast.error('Failed to proceed to checkout.');
    }
  };

  if (!product) {
    return <p className="text-center mt-5">Loading product details...</p>;
  }

  const averageRating = calculateAverageRating();
  const sizeOptions = product.variants ? [...new Set(product.variants.map((v) => v.size).filter(Boolean))] : [];
  const colorOptions = product.variants ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))] : [];
  const onlyOneSizeAndColor = sizeOptions.length === 1 && colorOptions.length === 1;
  const availableQuantity = selectedVariant ? selectedVariant.quantity : product.quantity;
  const requiresVariantSelection =
    product.variants &&
    product.variants.length > 1 &&
    (
      (sizeOptions.length > 0 && !selectedSize) ||
      (colorOptions.length > 0 && !selectedColor)
    );

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
          <Lottie
            animationData={successAnimation}
            loop={false}
            style={{ width: 240, height: 240, background: 'transparent' }}
          />
        </div>
      )}
      <div className="p-4">
        <div className="lg:max-w-6xl max-w-xl mx-auto">
          <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-8 max-lg:gap-12 max-sm:gap-8">
            {/* Image Section */}
            <div className="w-full lg:sticky top-0">
              <Suspense fallback={<div>Loading images...</div>}>
                <ProductImages
                  images={product.images}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  productName={product.name}
                />
              </Suspense>
            </div>
            {/* Product Info */}
            <div className="w-full">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{product.name}</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={
                        product.reviews?.length
                          ? index < Math.round(averageRating)
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                          : 'text-gray-300'
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-500">{product.reviews?.length || 0} reviews</p>
                <p className="text-sm text-slate-500">{product.sold || 0} sold</p>
              </div>
              <div className="flex items-center flex-wrap gap-4 mt-2">
                {/* Reduced mt-6 to mt-2 for less space above price */}
                <h4 className="text-slate-900 text-2xl sm:text-3xl font-semibold">
                  {selectedVariant
                    ? `₱${selectedVariant.price}`
                    : priceRange
                    ? `₱${priceRange.min}`
                    : `₱${product.price}`}
                </h4>
              </div>
              <Suspense fallback={<div>Loading variants...</div>}>
                <div className="mt-4">
                  {/* Added mt-4 for space between price and variants */}
                  <ProductVariants
                    product={product}
                    sizeOptions={sizeOptions}
                    colorOptions={colorOptions}
                    onlyOneSizeAndColor={onlyOneSizeAndColor}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                  />
                </div>
              </Suspense>
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                max={availableQuantity}
                onQuantityChange={handleQuantityChange}
              />
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className={`px-4 py-3 w-[45%] text-sm font-medium ${
                    availableQuantity > 0 && !requiresVariantSelection && localStorage.getItem('token')
                      ? 'border border-red-600 bg-red-600 hover:bg-red-700 text-white'
                      : 'border border-slate-400 bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={
                    availableQuantity === 0 ||
                    requiresVariantSelection
                  }
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`px-4 py-3 w-[45%] text-sm font-medium ${
                    availableQuantity > 0 && !requiresVariantSelection && localStorage.getItem('token')
                      ? 'border border-red-600 bg-white hover:bg-red-50 text-red-600'
                      : 'border border-slate-400 bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                  disabled={
                    availableQuantity === 0 ||
                    requiresVariantSelection
                  }
                >
                  Add to cart
                </button>
              </div>
              {!localStorage.getItem('token') && (
                <p className="text-center text-red-500 text-sm font-medium mt-2">
                  Please login or register first to add items to your cart.
                </p>
              )}
              <hr className="my-6 border-slate-300" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900">Product Information</h3>
                <div className="mt-4">
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {product.description || 'No additional product information available.'}
                  </p>
                </div>
              </div>
              <hr className="my-6 border-slate-300" />
              <Suspense fallback={<div>Loading reviews...</div>}>
                <ProductReviews reviews={product.reviews} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductView;