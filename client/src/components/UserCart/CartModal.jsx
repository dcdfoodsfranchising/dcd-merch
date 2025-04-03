import { useEffect, useState, useCallback } from "react";
import { getCartItems, updateCartQuantity, removeCartItem, clearCart as clearCartService } from "../../services/cartService"; // Ensure correct path
import { X, Trash, Plus, Minus } from "lucide-react"; // Icons

export default function CartModal({ isOpen, onClose }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Function to fetch cart items from the service
  const fetchCartItems = useCallback(async () => {
    if (!isOpen) return; // Don't fetch if modal is not open

    setLoading(true);
    try {
      const data = await getCartItems();  // Calling the service to fetch cart items
      console.log("Fetched Cart Items:", data);

      if (data?.cart) {
        setCartItems(data.cart.cartItems || []); 
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

  // Function to update the cart item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevents setting quantity to 0 or negative value
    setLoading(true);
    try {
      const updatedCart = await updateCartQuantity(productId, newQuantity); // Update quantity using the service
      setCartItems(updatedCart.cartItems); // Set updated cart items
      setTotalPrice(updatedCart.totalPrice); // Set updated total price
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const updatedCart = await removeCartItem(productId);  // Call service to remove item
      setCartItems(updatedCart.cartItems); // Update cart with the new items list
      setTotalPrice(updatedCart.totalPrice); // Update total price
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle cart clearing
  const clearCart = async () => {
    setLoading(true);
    try {
      const data = await clearCartService();  // Clear cart using the service
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
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
            <div key={item._id} className="flex items-center justify-between mb-4 border-b pb-2">
              <div>
                <h3 className="font-medium">{item.productId.name}</h3>
                <p className="text-sm text-gray-500">₱{item.price} x {item.quantity}</p>
                <p className="text-gray-700 font-semibold">Total: ₱{item.subtotal}</p>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center">
                <button
                  onClick={() => updateQuantity(item.productId, item.productId.quantity - 1)} // Decrease quantity
                  className="bg-gray-300 px-2 py-1 rounded-md hover:bg-gray-400"
                  disabled={loading || item.quantity <= 1} // Disable if quantity is 1 or less
                >
                  <Minus size={16} />
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)} // Increase quantity
                  className="bg-gray-300 px-2 py-1 rounded-md hover:bg-gray-400"
                  disabled={loading}
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => removeFromCart(item.productId)} // Remove item
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
      <div className="p-4 border-t flex justify-between">
        <h3 className="text-lg font-semibold">Total: ₱{totalPrice}</h3>
        <button
          onClick={clearCart} // Clear the cart
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          disabled={loading}
        >
          Clear Cart
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          disabled={loading}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
