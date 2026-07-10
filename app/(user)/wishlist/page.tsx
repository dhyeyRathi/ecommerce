"use client";

import { useWishlist } from "@/app/context/wishlistContext";
import { useCart } from "@/app/context/cartContext";
import { LoginContext } from "@/app/context/loginContext";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingCart, Heart, ArrowRight, Loader2, Plus, Minus } from "lucide-react";
import { addToCart } from "@/app/lib/supabase";

export default function WishlistPage() {
  const { wishlist, loading: wishlistLoading, toggleWishlistItem } = useWishlist();
  const { cart, updateQuantity, refreshCart } = useCart();
  const auth = useContext(LoginContext);
  const [addingToCartId, setAddingToCartId] = useState<number | null>(null);

  const getDiscountedPrice = (product: any) => {
    if (!product) return 0;
    const hasDiscount = product.discountPercentage > 0;
    return hasDiscount
      ? parseFloat((product.price - product.discountPercentage * (product.price / 100)).toFixed(2))
      : product.price;
  };

  const handleAddToCart = async (productId: number) => {
    setAddingToCartId(productId);
    try {
      await addToCart(productId, 1);
      await refreshCart();
    } catch (err: any) {
      console.error("Error adding to cart:", err.message);
    } finally {
      setAddingToCartId(null);
    }
  };

  if (!auth?.user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-heading px-4">
        <div className="bg-surface border border-border p-8 md:p-12 rounded-3xl text-center max-w-md w-full shadow-lg flex flex-col items-center gap-6">
          <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-full text-red-500">
            <Heart className="w-16 h-16 fill-red-500" />
          </div>
          <h1 className="text-3xl font-bold">Please Log In</h1>
          <p className="text-text-muted">
            You must be logged in to view and manage your personal wishlist.
          </p>
          <Link
            href="/login"
            className="bg-primary hover:bg-primary-hover text-white py-3 px-8 rounded-xl font-bold transition-all duration-200 shadow-md w-full"
          >
            Log In Now
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistLoading && !wishlist) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-heading">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background pt-24 pb-16 px-4 md:px-8 lg:px-16 text-heading">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">My Wishlist</h1>
          <p className="text-text-muted mt-2 text-base">
            {wishlist && wishlist.length > 0
              ? `You have ${wishlist.length} item(s) saved in your wishlist.`
              : "Save your favorite items here to purchase them later."}
          </p>
        </header>

        {!wishlist || wishlist.length === 0 ? (
          <div className="bg-surface border border-border rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs flex flex-col items-center gap-6 mt-10">
            <div className="bg-red-50 dark:bg-red-950/20 p-6 rounded-full text-red-500">
              <Heart className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
            <p className="text-text-muted max-w-sm">
              Keep track of items you love by clicking the heart button on the product details page.
            </p>
            <Link
              href="/products"
              className="bg-primary hover:bg-primary-hover text-white py-3 px-8 rounded-xl font-bold transition-all duration-200 shadow-md inline-flex items-center gap-2"
            >
              Discover Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item: any) => {
              const product = item.products;
              if (!product) return null;
              const price = getDiscountedPrice(product);
              const hasDiscount = product.discountPercentage > 0;
              const cartItem = cart?.find((cItem: any) => cItem.product_id === product.id);

              return (
                <div
                  key={item.id}
                  className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
                >
                  <div>
                    {/* Thumbnail and Category Badge */}
                    <div className="relative h-64 bg-background border-b border-border flex items-center justify-center p-6">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-4 left-4 text-xs uppercase tracking-wider text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-md">
                        {product.category}
                      </span>
                      <button
                        onClick={() => toggleWishlistItem(product.id)}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-surface border border-border text-red-500 hover:bg-red-50 hover:border-red-400 transition-colors shadow-xs"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/products/${product.category}/${product.slug}`}>
                          {product.title}
                        </Link>
                      </h3>
                      <p className="text-text-muted text-sm line-clamp-2 mb-4">
                        {product.description}
                      </p>

                      {/* Pricing */}
                      <div className="flex items-baseline gap-2 mb-6">
                        {hasDiscount ? (
                          <>
                            <span className="text-2xl font-black text-primary">
                              ${price}
                            </span>
                            <span className="line-through text-gray-400 text-sm">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-black text-heading">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 border-t border-border/50 bg-background/50 flex gap-3">
                    {cartItem ? (
                      <div className="flex-1 flex items-center justify-between border-2 border-primary rounded-xl px-2.5 py-2 bg-surface">
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                          className="p-1 hover:bg-primary/10 rounded text-primary transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm text-primary whitespace-nowrap">
                          {cartItem.quantity} in Cart
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                          className="p-1 hover:bg-primary/10 rounded text-primary transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCartId === product.id}
                        className="flex-1 bg-primary text-white text-sm font-bold py-3 px-4 rounded-xl hover:bg-primary-hover active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {addingToCartId === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" /> Add to Cart
                          </>
                        )}
                      </button>
                    )}
                    <Link
                      href={`/products/${product.category}/${product.slug}`}
                      className="bg-surface border border-border text-heading hover:bg-primary/5 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center"
                    >
                      View
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
