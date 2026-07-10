import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoginProvider } from "./context/loginContext";
import { AppContextProvider } from "./context/appContext";
import { ProductProvider } from "./context/productContext";
import { ProfileProvider } from "./context/profileContext";
import { CartProvider } from "./context/cartContext";
import { NotificationProvider } from "./context/notificationContext";
import { WishlistProvider } from "./context/wishlistContext";
import { preload } from "react-dom";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EZ mart",
  description: "An easy ecommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Preload products and categories API responses
  preload("/api/products", { as: "fetch", crossOrigin: "anonymous" });
  preload("/api/categories", { as: "fetch", crossOrigin: "anonymous" });

  // Preload critical IBM Plex Serif font variants to avoid critical chain delays
  preload("/fonts/ibm-plex-serif-v20-latin-300.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/ibm-plex-serif-v20-latin-regular.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/ibm-plex-serif-v20-latin-500.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/ibm-plex-serif-v20-latin-600.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen h-full w-full flex flex-col font-heading bg-background text-text">
        <LoginProvider>
          <ProfileProvider>
            <AppContextProvider>
              <ProductProvider>
                <NotificationProvider>
                  <WishlistProvider>
                    <CartProvider>{children}</CartProvider>
                  </WishlistProvider>
                </NotificationProvider>
              </ProductProvider>
            </AppContextProvider>
          </ProfileProvider>
        </LoginProvider>
      </body>
    </html>
  );
}

