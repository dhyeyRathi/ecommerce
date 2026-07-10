"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { LoginContext } from "./loginContext";

type CartContextType = {
  cart: any;
  loading: boolean;
  refreshCart: () => Promise<void>;
  updateQuantity: (cartItemId: number, newQuantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useContext(LoginContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<any>(null);

  const getCart = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        setCart(null);
      }
    } catch (err) {
      console.error("Error fetching cart on client:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });
      if (response.ok) {
        await getCart();
      } else {
        console.error("Failed to update cart quantity");
      }
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      const response = await fetch(`/api/cart?cartItemId=${encodeURIComponent(cartItemId)}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await getCart();
      } else {
        console.error("Failed to delete cart item");
      }
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      getCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [auth?.user]);

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart: getCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
    const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
