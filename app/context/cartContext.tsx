"use client";
import { supabase } from "../lib/supabase";
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCart(null);
      } else {
        const { data: cartItems, error } = await supabase
          .from("cart_items")
          .select(
            `
      *,
      products (*)
    `,
          )
          .eq("user_id", user.id);
        if (error) {
          console.error("Error fetching cart:", error.message);
          return ;
        }
        setCart(cartItems);
      }
    } catch (err) {
      console.error("Error fetching profile on client:", err);
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
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cartItemId);
      if (error) {
        console.error("Error updating cart quantity:", error.message);
      } else {
        await getCart();
      }
    } catch (err) {
      console.error("Error updating cart quantity:", err);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);
      if (error) {
        console.error("Error deleting cart item:", error.message);
      } else {
        await getCart();
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
