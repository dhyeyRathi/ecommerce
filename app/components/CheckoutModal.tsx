"use client";

import React, { useState, useEffect } from "react";
import { supabase, createOrder } from "@/app/lib/supabase";
import { X, Loader2 } from "lucide-react";
import { useNotification } from "@/app/context/notificationContext";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  items: { products: any; quantity: number }[];
  totalPrice: number;
  onSuccess: () => void;
};

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  totalPrice,
  onSuccess,
}: CheckoutModalProps) {
  const { showToast } = useNotification();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const [billingForm, setBillingForm] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();
          if (userData) {
            if (userData.shipping_address) {
              setShippingForm({
                street: userData.shipping_address.street || "",
                city: userData.shipping_address.city || "",
                state: userData.shipping_address.state || "",
                country: userData.shipping_address.country || "",
                zip: userData.shipping_address.zip || "",
              });
            }
            if (userData.billing_address) {
              setBillingForm({
                street: userData.billing_address.street || "",
                city: userData.billing_address.city || "",
                state: userData.billing_address.state || "",
                country: userData.billing_address.country || "",
                zip: userData.billing_address.zip || "",
              });
              setSameAsShipping(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load profile address", err);
      }
    }
    loadProfile();
  }, [isOpen]);

  const getDiscountedPrice = (product: any) => {
    if (!product) return 0;
    const hasDiscount = product.discountPercentage > 0;
    return hasDiscount
      ? parseFloat((product.price - product.discountPercentage * (product.price / 100)).toFixed(2))
      : product.price;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items || items.length === 0) return;

    setIsSubmittingOrder(true);
    try {
      const orderItems = items.map((item: any) => ({
        productId: item.products.id,
        quantity: item.quantity,
        price: getDiscountedPrice(item.products),
      }));

      const finalBilling = sameAsShipping ? shippingForm : billingForm;

      await createOrder(totalPrice, shippingForm, finalBilling, orderItems);
      onSuccess();
    } catch (err) {
      console.error("Order submission failed:", err);
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 mt-20 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-border flex flex-col my-8 max-h-[90vh]">
        <header className="border-b border-border p-6 flex justify-between items-center bg-background">
          <h2 className="text-2xl font-bold text-heading">Checkout details</h2>
          <button
            onClick={onClose}
            aria-label="Close checkout modal"
            className="p-1.5 hover:bg-primary/10 rounded-lg text-text-muted hover:text-heading transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleCheckoutSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <div className={sameAsShipping ? "grid grid-cols-1" : "grid grid-cols-1 lg:grid-cols-2 gap-8"}>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-heading border-b border-border pb-2">
                Shipping Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.street}
                    onChange={(e) => setShippingForm({ ...shippingForm, street: e.target.value })}
                    placeholder="e.g. 123 Main St"
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    placeholder="e.g. Los Angeles"
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    State / Province
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    placeholder="e.g. CA"
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Postal Code / ZIP
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.zip}
                    onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                    placeholder="e.g. 90001"
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingForm.country}
                    onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                    placeholder="e.g. United States"
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                  />
                </div>
              </div>
            </div>

            {!sameAsShipping && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-lg font-bold text-heading border-b border-border pb-2">
                  Billing Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={billingForm.street}
                      onChange={(e) => setBillingForm({ ...billingForm, street: e.target.value })}
                      placeholder="e.g. 123 Main St"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={billingForm.city}
                      onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                      placeholder="e.g. Los Angeles"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      State / Province
                    </label>
                    <input
                      type="text"
                      required
                      value={billingForm.state}
                      onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                      placeholder="e.g. CA"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Postal Code / ZIP
                    </label>
                    <input
                      type="text"
                      required
                      value={billingForm.zip}
                      onChange={(e) => setBillingForm({ ...billingForm, zip: e.target.value })}
                      placeholder="e.g. 90001"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={billingForm.country}
                      onChange={(e) => setBillingForm({ ...billingForm, country: e.target.value })}
                      placeholder="e.g. United States"
                      className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-text font-medium"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={sameAsShipping}
              onChange={(e) => setSameAsShipping(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <label htmlFor="sameAsShipping" className="text-sm font-semibold cursor-pointer">
              Billing address is the same as shipping address
            </label>
          </div>

          <div className="bg-background border border-border p-5 rounded-2xl flex items-center justify-between gap-4 mt-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-text-muted font-bold">Total Amount</span>
              <p className="text-2xl font-black text-heading">${totalPrice.toFixed(2)}</p>
            </div>
            <button
              type="submit"
              disabled={isSubmittingOrder}
              className="bg-primary hover:bg-primary-hover disabled:bg-gray-400 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              {isSubmittingOrder ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
