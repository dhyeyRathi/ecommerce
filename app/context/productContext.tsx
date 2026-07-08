import React from "react";
import { ProductClientProvider } from "./productClientContext";

export { useProducts } from "./productClientContext";

async function getProducts() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=194", {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    return data.products.map((product: any) => ({
      ...product,
      slug: product.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") 
        .trim()
        .replace(/\s+/g, "-"),  
    }));
  } catch (err) {
    console.error("Failed to fetch products on server:", err);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch("https://dummyjson.com/products/categories", {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch categories on server:", err);
    return [];
  }
}

export async function ProductProvider({ children }: { children: React.ReactNode }) {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <ProductClientProvider initialProducts={products} initialCategories={categories}>
      {children}
    </ProductClientProvider>
  );
}
