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
  other: {
    "geo.region": "IN",
    "geo.placename": "Mumbai",
    "geo.position": "19.0760;72.8777",
    "ICBM": "19.0760, 72.8777",
  }
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

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EZ Mart",
    "url": "https://ezmart.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ezmart.in/products?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EZ Mart",
    "url": "https://ezmart.in",
    "logo": "https://ezmart.in/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-000-111-999",
      "contactType": "customer service"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is EZ Mart?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "EZ Mart is an easy e-commerce platform that delivers everyday items including beauty, fashion, furniture, and electronics with fast shipping."
        }
      },
      {
        "@type": "Question",
        "name": "How long does shipping take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Shipping typically takes 2-5 business days depending on your locality. Orders are fully tracked and insured."
        }
      },
      {
        "@type": "Question",
        "name": "What is the return policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a 30-day money-back guarantee on all products in their original condition and packaging."
        }
      },
      {
        "@type": "Question",
        "name": "How do I track my order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can view your order status and tracking details under the 'Order History' page in your account dashboard."
        }
      },
      {
        "@type": "Question",
        "name": "Are payments on EZ Mart secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all transactions are processed using encrypted, SSL-secured checkouts to ensure the highest standards of safety for your payment data."
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
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

