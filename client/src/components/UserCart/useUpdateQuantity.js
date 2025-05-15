import { useState } from "react";
import { updateCartQuantity } from "../../services/cartService";

export function useUpdateQuantity(cartItems, setCartItems, setTotalPrice, fetchCartItems) {
  const [loadingItemId, setLoadingItemId] = useState(null);

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setLoadingItemId(cartItemId);

    const cartItem = cartItems.find(item => item._id === cartItemId);
    if (!cartItem) return;

    const updatedCartItems = cartItems.map((item) =>
      item._id === cartItemId
        ? {
            ...item,
            quantity: newQuantity,
            subtotal: (item.variant?.price ?? item.productId.price) * newQuantity,
          }
        : item
    );
    setCartItems(updatedCartItems);

    try {
      const updatedCart = await updateCartQuantity(cartItem, newQuantity);
      if (updatedCart?.cartItems) {
        const itemsWithSubtotal = updatedCart.cartItems.map((item) => {
          const prev = cartItems.find(i => i._id === item._id);
          return {
            ...item,
            quantity: item.quantity,
            subtotal: (item.variant?.price ?? prev?.productId.price) * item.quantity,
            productId: prev?.productId || item.productId,
          };
        });
        setCartItems(itemsWithSubtotal);
        setTotalPrice(updatedCart.totalPrice || 0);
      }
    } catch (error) {
      fetchCartItems();
    } finally {
      setLoadingItemId(null);
    }
  };

  return { updateQuantity, loadingItemId };
}