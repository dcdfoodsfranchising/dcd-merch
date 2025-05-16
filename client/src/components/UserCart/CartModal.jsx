import { useEffect, useState, useCallback } from "react";
import {
  getCartItems,
  removeCartItem,
  clearCart as clearCartService,
} from "../../services/cartService";
import { X } from "lucide-react";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import ConfirmationModal from "./ConfirmationModal";
import { useNavigate } from "react-router-dom";
import CartCard from "./CartCard";
import CheckoutButtons from "./CheckoutButtons";
import { useUpdateQuantity } from "./useUpdateQuantity";

export default function CartModal({ isOpen, onClose }) {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showModal, setShowModal] = useState(isOpen);

  const navigate = useNavigate();

  const fetchCartItems = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const data = await getCartItems();
      if (data?.cart && Array.isArray(data.cart.cartItems)) {
        const itemsWithSubtotal = data.cart.cartItems.map((item) => ({
          ...item,
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

  const removeFromCart = (productId) => {
    setItemToRemove(productId);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;
    setLoading(true);
    try {
      const updatedCart = await removeCartItem(itemToRemove);
      if (updatedCart?.cartItems) {
        const itemsWithSubtotal = updatedCart.cartItems.map((item) => ({
          ...item,
          subtotal: (item.variant?.price ?? item.productId.price) * item.quantity,
        }));
        setCartItems(itemsWithSubtotal);
        setTotalPrice(updatedCart.totalPrice || 0);
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
      setShowConfirm(false);
    } finally {
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
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-4 overflow-y-auto h-[70%]">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartCard
                key={item._id}
                item={item}
                loading={loadingItemId === item._id}
                onDecrease={() => updateQuantity(item._id, item.quantity - 1)}
                onIncrease={() => updateQuantity(item._id, item.quantity + 1)}
                onRemove={() => removeFromCart(item._id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Total: ₱{Number(totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <CheckoutButtons
              loading={loading}
              cartItems={cartItems}
              onClear={() => setShowConfirm(true)}
              onCheckout={handleCheckout}
            />
          </div>
        )}

        {/* Confirmation Modals */}
        <ConfirmationModal
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmRemove}
          message="Are you sure you want to remove this item from your cart?"
        />
      </div>
    </>
  );
}
