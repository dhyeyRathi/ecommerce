import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoginProvider } from "./context/loginContext";
import { AppContextProvider } from "./context/appContext";
import { ProductProvider } from "./context/productContext";
import { ProfileProvider } from "./context/profileContext";



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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen h-full w-full flex flex-col  font-heading bg-surface">
        <AppContextProvider>
          <ProductProvider>
            <LoginProvider>
              <ProfileProvider>
                {children}
              </ProfileProvider>
            </LoginProvider>
          </ProductProvider>
        </AppContextProvider>
       </body>
    </html>
  );
}
