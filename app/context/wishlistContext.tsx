"use client";
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
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      } else {
        setWishlist(null);
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
      const existing = wishlist?.find((item: any) => item.product_id === productId);
      if (existing) {
        const response = await fetch(`/api/wishlist?productId=${encodeURIComponent(productId)}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await getWishlist();
        } else {
          console.error("Failed to remove from wishlist");
        }
      } else {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId }),
        });
        if (response.ok) {
          await getWishlist();
        } else {
          console.error("Failed to add to wishlist");
        }
      }
    } catch (err) {
      console.error("Error toggling wishlist item:", err);
    }
  };

  useEffect(() => {
    if (auth?.user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
