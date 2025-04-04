// CartModal.js
import { useEffect, useState, useCallback } from "react";
import {
  getCartItems,
  updateCartQuantity,
  removeCartItem,
  clearCart as clearCartService,
} from "../../services/cartService";
import { X, Trash, Plus, Minus } from "lucide-react";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import ConfirmationModal from "./ConfirmationModal"; // Import the new ConfirmationModal

export default function CartModal({ isOpen, onClose }) {
  const { user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // State to control confirmation modal visibility
  const [itemToRemove, setItemToRemove] = useState(null); // To track which item needs confirmation for removal

  const fetchCartItems = useCallback(async () => {
    if (!isOpen) return;

    setLoading(true);
    try {
      const data = await getCartItems();
      console.log("Fetched Cart Items:", data);

      if (data?.cart) {
        const itemsWithSubtotal = data.cart.cartItems.map((item) => ({
          ...item,
          subtotal: item.productId.price * item.quantity,
        }));

        setCartItems(itemsWithSubtotal);
        setTotalPrice(data.cart.totalPrice || 0);
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItems([]);
      setTotalPrice(0);
    } finally {
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCartItems = cartItems.map((item) =>
      item.productId._id === productId
        ? {
            ...item,
            quantity: newQuantity,
            subtotal: item.productId.price * newQuantity,
          }
        : item
    );
    setCartItems(updatedCartItems);

    setLoading(true);
    try {
      const updatedCart = await updateCartQuantity(productId, newQuantity);
      setTotalPrice(updatedCart.totalPrice);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      fetchCartItems(); // fallback if failed
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (productId) => {
    setItemToRemove(productId); // Set the item to remove
    setShowConfirm(true); // Show confirmation modal
  };

  const confirmRemove = async () => {
    if (!itemToRemove) return;

    setLoading(true);
    try {
      const updatedCart = await removeCartItem(itemToRemove, user.token); // 👈 pass token

      if (updatedCart?.cartItems) {
        const itemsWithSubtotal = updatedCart.cartItems.map((item) => ({
          ...item,
          subtotal: item.productId.price * item.quantity,
        }));
        setCartItems(itemsWithSubtotal);
        setTotalPrice(updatedCart.totalPrice || 0);
      } else {
        setCartItems([]);
        setTotalPrice(0);
      }
      setShowConfirm(false); // Close the confirmation modal
    } catch (error) {
      console.error("Failed to remove item:", error);
      setShowConfirm(false); // Close the confirmation modal on error
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await clearCartService(user.token); // 👈 pass token
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout");
    // Example: navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
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
              <div
                key={item._id}
                className="flex items-center justify-between mb-4 border-b pb-2"
              >
                <div>
                  <h3 className="font-medium">{item.productId.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₱{item.productId.price} x {item.quantity}
                  </p>
                  <p className="text-gray-700 font-semibold">
                    Total: ₱{item.subtotal.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId._id, item.quantity - 1)
                    }
                    className="bg-gray-300 px-2 py-1 rounded-md hover:bg-gray-400"
                    disabled={loading || item.quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId._id, item.quantity + 1)
                    }
                    className="bg-gray-300 px-2 py-1 rounded-md hover:bg-gray-400"
                    disabled={loading}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.productId._id)}
                    className="text-red-500 hover:text-red-700 ml-4"
                    disabled={loading}
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Total: ₱{totalPrice.toFixed(2)}</h3>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowConfirm(true)} // Show confirmation for clear cart
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-1/2 mr-2"
                disabled={loading}
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 w-1/2 ml-2"
                disabled={loading || cartItems.length === 0}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmRemove} // Confirm item removal
        message="Are you sure you want to remove this item from your cart?"
      />
    </>
  );
}
