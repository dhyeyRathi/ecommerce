import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(orders || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { totalPrice, shippingAddress, billingAddress, items } = await req.json();
    if (!totalPrice || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid order details" }, { status: 400 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_price: totalPrice,
        shipping_address: shippingAddress,
        billing_address: billingAddress,
        status: "pending"
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItemsData = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_at_purchase: item.price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    // Update stock in products
    for (const item of items) {
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.productId)
        .single();
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.productId);
      }
    }

    // Clear user's cart
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select(`
        status,
        order_items (
          product_id,
          quantity
        )
      `)
      .eq("id", orderId)
      .single();

    if (fetchError) throw fetchError;

    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (deleteError) throw deleteError;

    if (order.order_items) {
      for (const item of order.order_items) {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();
        if (product) {
          await supabase
            .from("products")
            .update({ stock: product.stock + item.quantity })
            .eq("id", item.product_id);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to cancel order" }, { status: 500 });
  }
}
