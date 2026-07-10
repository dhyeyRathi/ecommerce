import { createClient } from "@supabase/supabase-js";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if(!supabaseUrl||!supabaseAnonKey){
    throw new Error('missing supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);





export async function fetchUserOrders() {

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

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
  if (error) {
    console.error("Error fetching orders:", error.message);
    return [];
  }
  return orders;
}

export async function addToCart(productId: number, quantityToAdd: number = 1) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to add items to the cart.");
  }

  const { data: existingItem, error: fetchError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (fetchError) {
    console.error("Error checking cart:", fetchError.message);
    throw fetchError;
  }

  if (existingItem) {
    const { data, error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantityToAdd })
      .eq("id", existingItem.id)
      .select()
      .single();

    if (updateError) throw updateError;
    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity: quantityToAdd
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return data;
  }
}

export async function createOrder(totalPrice: number, shippingAddress: any, billingAddress: any, items: { productId: number, quantity: number, price: number }[]) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  
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

  const orderItemsData = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_purchase: item.price
  }));
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData);
  if (itemsError) throw itemsError;

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

  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);
  return order;
}

export async function cancelOrder(orderId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

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
}

export async function addToWishlist(productId: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to add items to the wishlist.");
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .insert({
      user_id: user.id,
      product_id: productId
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromWishlist(productId: number) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be logged in to remove items from the wishlist.");
  }

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) throw error;
}

