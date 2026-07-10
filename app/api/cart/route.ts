import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabaseServer";

export async function GET() {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select("*, products (*)")
      .eq("user_id", user.id);

    if (error) throw error;
    return NextResponse.json(cartItems || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch cart" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const { data: existingItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existingItem) {
      const { data, error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return NextResponse.json(data);
    } else {
      const { data, error: insertError } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: quantity
        })
        .select()
        .single();

      if (insertError) throw insertError;
      return NextResponse.json(data);
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update cart" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cartItemId, quantity } = await req.json();
    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: "cartItemId and quantity are required" }, { status: 400 });
    }

    if (quantity <= 0) {
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);
      if (deleteError) throw deleteError;
      return NextResponse.json({ success: true, deleted: true });
    }

    const { data, error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .select()
      .single();

    if (updateError) throw updateError;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update quantity" }, { status: 500 });
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
    const cartItemId = url.searchParams.get("cartItemId");

    if (cartItemId) {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);
      if (error) throw error;
    } else {
      // Clear entire cart
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete item(s)" }, { status: 500 });
  }
}
