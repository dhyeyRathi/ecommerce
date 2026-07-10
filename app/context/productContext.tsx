import React from "react";
import { supabase } from "@/app/lib/supabase";
import { ProductClientProvider } from "./productClientContext";
import { unstable_cache } from "next/cache";

export { useProducts } from "./productClientContext";

export const getProducts = unstable_cache(
  async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*, product_reviews(*)');

      if (error) throw error;
      if (!products) return [];

      return products.map((product: any) => ({
        ...product,
        discountPercentage: product.discount_percentage,
        reviews: (product.product_reviews || []).map((review: any) => ({
          ...review,
          reviewerName: review.reviewer_name,
          reviewerEmail: review.reviewer_email,
        })),
      }));
    } catch (err) {
      console.error("Failed to fetch products on server:", err);
      return [];
    }
  },
  ["products-list"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["products"],
  }
);

export const getCategories = unstable_cache(
  async () => {
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('*');

      if (error) throw error;
      if (!categories) return [];

      return categories;
    } catch (err) {
      console.error("Failed to fetch categories on server:", err);
      return [];
    }
  },
  ["categories-list"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["categories"],
  }
);

export async function ProductProvider({ children }: { children: React.ReactNode }) {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <ProductClientProvider initialProducts={products} initialCategories={categories}>
      {children}
    </ProductClientProvider>
  );
}
