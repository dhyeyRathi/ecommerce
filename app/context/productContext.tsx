"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ProductContextType = {
  products: any[] | undefined;
  categories: any[] | undefined;
  loading: boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<any[] | undefined>();
  const [categories, setCategories] = useState<any[] | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = fetch("https://dummyjson.com/products?limit=194")
      .then((res) => res.json())
      .then((data) => {
        const productsWithSlug = data.products.map((product: any) => ({
          ...product,
          slug: product.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "") 
            .trim()
            .replace(/\s+/g, "-"),  
        }));
        setProducts(productsWithSlug);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });

    const fetchCategories = fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
      });

    Promise.all([fetchProducts, fetchCategories]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
