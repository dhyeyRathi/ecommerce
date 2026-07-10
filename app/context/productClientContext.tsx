"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ProductContextType = {
  products: any[] | undefined;
  categories: any[] | undefined;
  loading: boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductClientProvider({
  children,
  initialProducts,
  initialCategories,
}: {
  children: React.ReactNode;
  initialProducts?: any[] | undefined;
  initialCategories?: any[] | undefined;
}) {
  const [products, setProducts] = useState<any[] | undefined>(initialProducts);
  const [categories, setCategories] = useState<any[] | undefined>(initialCategories);
  const [loading, setLoading] = useState<boolean>(!initialProducts);

  useEffect(() => {
    if (!initialProducts) {
      const loadProductsData = async () => {
        try {
          const [prodRes, catRes] = await Promise.all([
            fetch("/api/products"),
            fetch("/api/categories"),
          ]);
          if (prodRes.ok && catRes.ok) {
            const prodData = await prodRes.json();
            const catData = await catRes.json();
            setProducts(prodData);
            setCategories(catData);
          }
        } catch (err) {
          console.error("Failed to load products dynamically:", err);
        } finally {
          setLoading(false);
        }
      };
      loadProductsData();
    }
  }, [initialProducts]);

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
