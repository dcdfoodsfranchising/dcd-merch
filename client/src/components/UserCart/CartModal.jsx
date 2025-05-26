import { useEffect, useState, useCallback } from "react";
import {
  getCartItems,
  removeCartItem,
  clearCart as clearCartService,
} from "../../services/cartService";
import { X } from "lucide-react";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import CartCard from "./CartCard";
import CheckoutButtons from "./CheckoutButtons";
import { useUpdateQuantity } from "./useUpdateQuantity";

export default function CartModal({ isOpen, onClose }) {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(isOpen);
  const [removingItemIds, setRemovingItemIds] = useState([]);

  const navigate = useNavigate();

  const fetchCartItems = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const data = await getCartItems();
      if (data?.cart && Array.isArray(data.cart.cartItems)) {
        const itemsWithSubtotal = data.cart.cartItems.map((item) => ({
          ...item,
          color: item.variant?.color,
          size: item.variant?.size,
          subtotal: (item.variant?.price ?? item.productId.price) * item.quantity,
        }));
        setCartItems(itemsWithSubtotal);
        setTotalPrice(data.cart.totalPrice || 0);
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch {
      setCartItems([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      // Wait for animation before unmounting
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const { updateQuantity, loadingItemId } = useUpdateQuantity(
    cartItems,
    setCartItems,
    setTotalPrice,
    fetchCartItems
  );

  // Remove item with animation (now just remove immediately)
  const handleRemove = async (cartItem) => {
    setLoading(true);
    try {
      await removeCartItem(
        cartItem.productId._id,
        cartItem.variant.size,
        cartItem.variant.color
      );
      await fetchCartItems();
    } finally {
      setRemovingItemIds((prev) => prev.filter(id => id !== cartItem._id));
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await clearCartService(user.token);
      setCartItems([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    localStorage.removeItem('buyNowDetails'); // <-- Add this line
    navigate('/delivery');
  };

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-10 z-40 transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 overflow-y-auto h-[70%]">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item._id}>
                <CartCard
                  item={item}
                  loading={loadingItemId === item._id}
                  onDecrease={() => updateQuantity(item._id, item.quantity - 1)}
                  onIncrease={() => updateQuantity(item._id, item.quantity + 1)}
                  onRemove={() => handleRemove(item)}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <img src="/assets/icons/shopping.svg" alt="Empty cart" className="w-48 h-48 mb-4 opacity-80" />
              <p className="text-center text-gray-500 mb-4">Your cart is empty.</p>
              <button
                className="px-6 py-2 bg-red-700 text-white hover:bg-red-600 transition"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-semibold">
                ₱{Number(totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <button
              className="mt-4 w-full px-6 py-3 bg-red-700 text-white text-lg font-semibold hover:bg-red-600 transition"
              onClick={handleCheckout}
              disabled={loading}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
