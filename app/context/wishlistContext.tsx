"use client";
import { supabase } from "../lib/supabase";
import { useState, useEffect, createContext, useContext } from "react";
import { LoginContext } from "./loginContext";

type WishlistContextType = {
  wishlist: any;
  loading: boolean;
  refreshWishlist: () => Promise<void>;
  toggleWishlistItem: (productId: number) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useContext(LoginContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<any>(null);

  const getWishlist = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setWishlist(null);
      } else {
        const { data: wishlistItems, error } = await supabase
          .from("wishlist_items")
          .select(
            `
              *,
              products (*)
            `
          )
          .eq("user_id", user.id);
        if (error) {
          console.error("Error fetching wishlist:", error.message);
          return;
        }
        setWishlist(wishlistItems);
      }
    } catch (err) {
      console.error("Error fetching wishlist on client:", err);
      setWishlist(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlistItem = async (productId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const existing = wishlist?.find((item: any) => item.product_id === productId);
      if (existing) {
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
        if (error) {
          console.error("Error removing from wishlist:", error.message);
        } else {
          await getWishlist();
        }
      } else {
        const { error } = await supabase
          .from("wishlist_items")
          .insert({
            user_id: user.id,
            product_id: productId
          });
        if (error) {
          console.error("Error adding to wishlist:", error.message);
        } else {
          await getWishlist();
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist item:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      getWishlist();
    } else {
      setWishlist(null);
      setLoading(false);
    }
  }, [auth?.user]);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, refreshWishlist: getWishlist, toggleWishlistItem }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
