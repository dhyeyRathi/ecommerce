"use client";

import { useCart } from "@/app/context/cartContext";
import React, { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";

const CheckoutModal = dynamic(() => import("@/app/components/CheckoutModal"), {
  ssr: false,
});

export default function CartPage() {
  const { cart, loading, refreshCart, updateQuantity, removeFromCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const getDiscountedPrice = (product: any) => {
    if (!product) return 0;
    const hasDiscount = product.discountPercentage > 0;
    return hasDiscount
      ? parseFloat((product.price - product.discountPercentage * (product.price / 100)).toFixed(2))
      : product.price;
  };

  // Calculations
  const subtotal = cart
    ? cart.reduce((sum: number, item: any) => {
        const price = getDiscountedPrice(item.products);
        return sum + price * item.quantity;
      }, 0)
    : 0;

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  const handleCheckoutSuccess = async () => {
    await refreshCart();
    setOrderSuccess(true);
    setCheckingOut(false);
  };

  if (loading && !cart) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-heading">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Loading your shopping cart...</p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-heading px-4">
        <div className="bg-surface border-2 border-border p-8 md:p-12 rounded-3xl text-center max-w-md w-full shadow-lg flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full text-primary mb-6 animate-bounce">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Order Placed!</h1>
          <p className="text-text-muted mb-8">
            Thank you for your purchase! Your order has been placed successfully and is being processed.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Link
              href="/myorders"
              className="bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-xl font-bold transition-all duration-200 shadow-md w-full"
            >
              View My Orders
            </Link>
            <Link
              href="/products"
              className="bg-background border border-border text-heading hover:bg-primary/5 py-3 px-6 rounded-xl font-bold transition-all duration-200 w-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background pt-24 pb-16 px-4 md:px-8 lg:px-16 text-heading">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Shopping Cart</h1>
          <p className="text-text-muted mt-2 text-base">
            {cart && cart.length > 0
              ? `You have ${cart.length} unique item(s) in your cart.`
              : "Review and manage your items before checking out."}
          </p>
        </header>

        {!cart || cart.length === 0 ? (
          <div className="bg-surface border border-border rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs flex flex-col items-center gap-6 mt-10">
            <div className="bg-primary/10 p-6 rounded-full text-primary">
              <ShoppingCart className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-text-muted max-w-sm">
              Looks like you haven't added anything to your cart yet. Browse our amazing categories and find something you love!
            </p>
            <Link
              href="/products"
              className="bg-primary hover:bg-primary-hover text-white py-3 px-8 rounded-xl font-bold transition-all duration-200 shadow-md inline-flex items-center gap-2"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {cart.map((item: any) => {
                const product = item.products;
                if (!product) return null;
                const unitPrice = getDiscountedPrice(product);
                const hasDiscount = product.discountPercentage > 0;

                return (
                  <div
                    key={item.id}
                    className="bg-surface border border-border rounded-2xl p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 shadow-xs hover:border-primary/20 transition-all duration-200"
                  >
                    {/* Thumbnail */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-background border border-border rounded-xl flex items-center justify-center p-2 shrink-0">
                      <Image
                        src={product.thumbnail || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
                        alt={product.title || "Product thumbnail"}
                        width={128}
                        height={128}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between text-center sm:text-left w-full">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <span className="text-xs uppercase tracking-wider text-primary font-bold">
                              {product.category}
                            </span>
                            <h3 className="text-lg md:text-xl font-bold hover:text-primary transition-colors">
                              <Link href={`/products/${product.category}/${product.slug}`}>
                                {product.title}
                              </Link>
                            </h3>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 self-center sm:self-start p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-text-muted text-sm line-clamp-2 mt-1.5">
                          {product.description}
                        </p>
                      </div>

                      {/* Pricing and Quantity */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                        <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-1 py-0.5 shadow-2xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-surface text-heading hover:text-primary rounded-lg transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-surface text-heading hover:text-primary rounded-lg transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right sm:text-right">
                          <div className="flex items-center gap-2 justify-center sm:justify-end">
                            {hasDiscount ? (
                              <>
                                <span className="line-through text-gray-400 text-sm">
                                  ${(product.price * item.quantity).toFixed(2)}
                                </span>
                                <span className="text-lg font-black text-primary">
                                  ${(unitPrice * item.quantity).toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-black text-heading">
                                ${(unitPrice * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-text-muted">
                            ${unitPrice.toFixed(2)} each
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-xs flex flex-col gap-6 sticky top-24">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="flex flex-col gap-3 text-sm md:text-base text-text-muted">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-heading">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-heading">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-heading">${tax.toFixed(2)}</span>
                </div>
                <hr className="border-border my-2" />
                <div className="flex justify-between text-lg font-black text-heading">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-primary/5 border border-primary/20 text-primary-hover p-4 rounded-xl text-xs font-medium">
                  Add <span className="font-bold">${(100 - subtotal).toFixed(2)}</span> more to your order for free shipping!
                </div>
              )}

              <button
                onClick={() => setCheckingOut(true)}
                className="bg-primary hover:bg-primary-hover text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer w-full"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                href="/products"
                className="text-center text-primary font-bold hover:underline text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {cart && (
        <CheckoutModal
          isOpen={checkingOut}
          onClose={() => setCheckingOut(false)}
          items={cart}
          totalPrice={total}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
