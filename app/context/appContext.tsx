"use client";

import { createContext, useState, useEffect, useContext } from "react";

export const THEMES = {
  emerald: {
    name: "Emerald",
    primaryColor: "#059669",
    bgColor: "#f4fcf8",
    isDark: false,
  },
  ocean: {
    name: "Ocean Blue",
    primaryColor: "#0ea5e9",
    bgColor: "#f5faff",
    isDark: false,
  },
  purple: {
    name: "Royal Purple",
    primaryColor: "#7c3aed",
    bgColor: "#faf8ff",
    isDark: false,
  },
  orange: {
    name: "Sunset Orange",
    primaryColor: "#ea580c",
    bgColor: "#fff8f3",
    isDark: false,
  },
  rose: {
    name: "Rose",
    primaryColor: "#e11d48",
    bgColor: "#fff8fa",
    isDark: false,
  },
  sand: {
    name: "Sand",
    primaryColor: "#c58b39",
    bgColor: "#fcfaf5",
    isDark: false,
  },
  darkEmerald: {
    name: "Dark Emerald",
    primaryColor: "#10b981",
    bgColor: "#081311",
    isDark: true,
  },
  darkSlate: {
    name: "Dark Slate",
    primaryColor: "#38bdf8",
    bgColor: "#0f172a",
    isDark: true,
  },
  coffee: {
    name: "Coffee",
    primaryColor: "#8b5e3c",
    bgColor: "#faf7f2",
    isDark: false,
  },
  midnightIndigo: {
    name: "Midnight Indigo",
    primaryColor: "#6366f1",
    bgColor: "#111827",
    isDark: true,
  }
};

type AppContextType = {
  currency: string;
  theme: string;
  setTheme: (themeName: string) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const currency = "$";
  const [theme, setThemeState] = useState<string>("midnightIndigo");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "midnightIndigo";
    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName: string) => {
    const themeData = THEMES[themeName as keyof typeof THEMES];
    if (themeData) {
      document.documentElement.setAttribute("data-theme", themeName);
      if (themeData.isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const setTheme = (themeName: string) => {
    setThemeState(themeName);
    localStorage.setItem("theme", themeName);
    applyTheme(themeName);
  };

  return (
    <AppContext.Provider value={{ currency, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
}