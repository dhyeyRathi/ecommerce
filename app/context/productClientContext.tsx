"use client";

import React, { createContext, useContext, useState } from "react";

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
  initialProducts: any[] | undefined;
  initialCategories: any[] | undefined;
}) {
  const [products] = useState<any[] | undefined>(initialProducts);
  const [categories] = useState<any[] | undefined>(initialCategories);

  return (
    <ProductContext.Provider value={{ products, categories, loading: false }}>
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
