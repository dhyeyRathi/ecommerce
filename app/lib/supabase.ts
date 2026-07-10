import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn("Warning: Supabase credentials are not set in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchUserOrders() {
  const response = await fetch("/api/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

export async function addToCart(productId: number, quantityToAdd: number = 1) {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId, quantity: quantityToAdd }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add to cart");
  }
  return response.json();
}

export async function createOrder(
  totalPrice: number,
  shippingAddress: any,
  billingAddress: any,
  items: { productId: number; quantity: number; price: number }[]
) {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      totalPrice,
      shippingAddress,
      billingAddress,
      items,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create order");
  }
  return response.json();
}

export async function cancelOrder(orderId: string) {
  const response = await fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to cancel order");
  }
  return response.json();
}

