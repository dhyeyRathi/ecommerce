"use client";

import { createContext, useState } from "react";

type AppContextType = {
  currency: string;
};

export const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currency = "$";

  return (
    <AppContext.Provider value={{ currency }}>
      {children}
    </AppContext.Provider>
  );
}