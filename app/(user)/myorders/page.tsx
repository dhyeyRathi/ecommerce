"use client";

import React, { useState } from "react";
import { useOrders } from "@/app/hooks/useOrders";
import Link from "next/link";
import { Package, Clock, MapPin, ChevronDown, ChevronUp, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { cancelOrder } from "@/app/lib/supabase";

import { useNotification } from "@/app/context/notificationContext";

export default function MyOrdersPage() {
  const { orders, loading, error, refreshOrders } = useOrders();
  const { showToast, confirmCustom } = useNotification();
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleCancelOrder = async (orderId: string) => {
    const isConfirmed = await confirmCustom({
      title: "Cancel Order",
      message: "Are you sure you want to cancel this order? This action will restore product stock and cannot be undone.",
    });
    if (!isConfirmed) {
      return;
    }
    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId);
      await refreshOrders();
      showToast("Order cancelled successfully.", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to cancel order", "error");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "processing":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-heading">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Loading your purchase history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background text-heading px-4">
        <div className="bg-surface border border-border rounded-3xl p-8 text-center max-w-md w-full shadow-lg">
          <p className="text-red-500 font-bold mb-4">Error loading orders</p>
          <p className="text-text-muted mb-6">{error}</p>
          <button
            onClick={refreshOrders}
            className="bg-primary hover:bg-primary-hover text-white py-2.5 px-6 rounded-xl font-bold transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background pt-24 pb-16 px-4 md:px-8 lg:px-16 text-heading">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">My Orders</h1>
            <p className="text-text-muted mt-2 text-base">
              Track and review your past purchases and shipping statuses.
            </p>
          </div>
          <button
            onClick={refreshOrders}
            className="text-primary hover:text-primary-hover text-sm font-bold border border-primary/20 hover:border-primary/40 bg-surface py-2 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs self-center md:self-auto"
          >
            Refresh History
          </button>
        </header>

        {orders.length === 0 ? (
          <div className="bg-surface border border-border rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs flex flex-col items-center gap-6 mt-10">
            <div className="bg-primary/10 p-6 rounded-full text-primary">
              <ShoppingBag className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold">No orders found</h2>
            <p className="text-text-muted max-w-sm">
              It looks like you haven't placed any orders yet. Discover our latest items and fill up your cart!
            </p>
            <Link
              href="/products"
              className="bg-primary hover:bg-primary-hover text-white py-3 px-8 rounded-xl font-bold transition-all duration-200 shadow-md inline-flex items-center gap-2"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => {
              const orderIdShort = order.id.substring(0, 8).toUpperCase();
              const isExpanded = !!expandedOrders[order.id];
              const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div
                  key={order.id}
                  className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs hover:border-primary/20 transition-all duration-200"
                >
                  <div
                    onClick={() => toggleExpand(order.id)}
                    className="p-5 md:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 cursor-pointer hover:bg-background/20 transition-colors select-none"
                  >
                    <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 flex-1">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-text-muted font-bold block mb-1">
                          Order Number
                        </span>
                        <span className="font-mono font-bold text-sm md:text-base text-heading">
                          #{orderIdShort}...
                        </span>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-text-muted font-bold block mb-1">
                          Date Placed
                        </span>
                        <div className="flex items-center gap-1.5 text-sm md:text-base text-heading font-medium">
                          <Clock className="w-4 h-4 text-text-muted" />
                          <span>{orderDate}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-text-muted font-bold block mb-1">
                          Total Amount
                        </span>
                        <span className="text-base md:text-lg font-black text-primary">
                          ${parseFloat(order.total_price).toFixed(2)}
                        </span>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-xs uppercase tracking-wider text-text-muted font-bold block mb-1">
                          Shipping Status
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                            order.status
                          )} uppercase tracking-wider`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end border-t border-border/50 md:border-none pt-3 md:pt-0 shrink-0">
                      <span className="text-primary font-bold text-sm mr-2 hidden md:inline">
                        {isExpanded ? "Hide Details" : "View Details"}
                      </span>
                      <div className="bg-primary/5 hover:bg-primary/10 p-2 rounded-xl text-primary transition-colors">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border bg-background/30 p-6 md:p-8 space-y-6 animate-fadeIn">
                      <div className="bg-surface border border-border/80 rounded-xl p-5 shadow-3xs flex flex-col sm:flex-row gap-6">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-primary/5 p-2.5 rounded-lg text-primary mt-0.5">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm md:text-base text-heading mb-1.5">
                              Shipping Destination
                            </h4>
                            <p className="text-sm text-text font-medium">
                              {order.shipping_address.street}
                            </p>
                            <p className="text-sm text-text-muted">
                              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                            </p>
                            <p className="text-xs text-text-muted mt-0.5">
                              {order.shipping_address.country}
                            </p>
                          </div>
                        </div>

                        {order.billing_address && (
                          <div className="flex items-start gap-3 flex-1 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                            <div className="bg-primary/5 p-2.5 rounded-lg text-primary mt-0.5">
                              <Package className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm md:text-base text-heading mb-1.5">
                                Billing Address
                              </h4>
                              <p className="text-sm text-text font-medium">
                                {order.billing_address.street}
                              </p>
                              <p className="text-sm text-text-muted">
                                {order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}
                              </p>
                              <p className="text-xs text-text-muted mt-0.5">
                                {order.billing_address.country}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-heading mb-4 px-1">Items In This Order</h4>
                        <div className="flex flex-col gap-4">
                          {order.order_items?.map((item: any) => {
                            const product = item.products;
                            if (!product) return null;

                            return (
                              <div
                                key={item.id}
                                className="bg-surface border border-border/60 rounded-xl p-4 flex items-center gap-4 hover:border-primary/10 transition-all duration-200"
                              >
                                <div className="w-16 h-16 bg-background border border-border rounded-lg flex items-center justify-center p-1.5 shrink-0">
                                  <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-[10px] uppercase tracking-wider text-primary font-bold block">
                                    {product.category}
                                  </span>
                                  <h5 className="font-bold text-sm md:text-base text-heading truncate">
                                    <Link href={`/products/${product.category}/${product.slug}`} className="hover:underline">
                                      {product.title}
                                    </Link>
                                  </h5>
                                  <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                                    {product.description}
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-black text-sm md:text-base text-heading block">
                                    ${(parseFloat(item.price_at_purchase) * item.quantity).toFixed(2)}
                                  </span>
                                  <span className="text-xs text-text-muted">
                                    ${parseFloat(item.price_at_purchase).toFixed(2)} × {item.quantity}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {(order.status === "pending" || order.status === "processing") && (
                        <div className="flex justify-end pt-4 border-t border-border/50">
                          <button
                            disabled={cancellingOrderId === order.id}
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold py-2.5 px-6 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-3xs disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 flex items-center gap-2"
                          >
                            {cancellingOrderId === order.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Cancelling...
                              </>
                            ) : (
                              "Cancel Order"
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
