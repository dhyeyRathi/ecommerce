"use client";

import React from "react";
import Link from "next/link";
import { useProducts } from "../context/productContext";
import ProductCard from "../components/ProductCard";
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { products, categories } = useProducts();
  const router = useRouter();

  const [heroProduct, setHeroProduct] = React.useState<any>(null);

  React.useEffect(() => {
    if (products && products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      setHeroProduct(products[randomIndex]);
    }
  }, [products]);

  const featuredProducts = products
    ? [...products]
        .filter((product: any) => product && product.id && product.category && product.slug)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4)
    : [];

  return (
    <div className="w-full bg-background font-sans dark:bg-black min-h-screen text-heading pb-20">


      <section className="relative overflow-hidden min-h-screen bg-gradient-to-tr from-primary/5 via-background to-primary/5 pt-20 pb-12 lg:pt-32 lg:pb-16 border-b border-border/40 flex flex-col justify-between">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 my-auto w-full">

          <div className="flex flex-col space-y-6">


            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none">
              Your Everyday Needs, <br />
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Delivered Effortlessly</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Explore premium products across beauty, electronics, fashion, and furniture. Fast shipping, secure payments, and unbeatable deals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center space-x-2 bg-primary text-background font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-primary/20 hover:opacity-90 transition-all duration-200"
              >
                <span>Shop All Products</span>
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            {heroProduct && (
              <div
                onClick={() => router.push(`/products/${heroProduct.category}/${heroProduct.slug}`)}
                className="relative w-full max-w-[450px] aspect-square rounded-2xl overflow-hidden flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-primary/5 border border-border/40 shadow-lg group cursor-pointer hover:border-primary/30 transition-all duration-300"
              >
                <img
                  src={heroProduct.thumbnail}
                  alt={heroProduct.title}
                  className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur px-3 py-1.5 rounded-lg border border-border/50 shadow-sm text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  Featured: {heroProduct.title}
                </div>
              </div>
            )}
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 mt-12 border-t border-border/20 pt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-primary">190+</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Curated Products</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-primary">20+</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Top Categories</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-primary">99.8%</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-extrabold text-primary">24/7</p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Instant Support</p>
          </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-border/40">
        <div className="flex items-start space-x-4 p-6 rounded-xl bg-card border border-border/40 shadow-sm">
          <div className="bg-primary/10 p-3 rounded-lg text-primary">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground mt-1">Get your items delivered to your doorstep in no time, fully insured.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-6 rounded-xl bg-card border border-border/40 shadow-sm">
          <div className="bg-primary/10 p-3 rounded-lg text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Secure Payment</h3>
            <p className="text-sm text-muted-foreground mt-1">Multiple secure billing methods for a safer shopping experience.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-6 rounded-xl bg-card border border-border/40 shadow-sm">
          <div className="bg-primary/10  p-3 rounded-lg text-primary">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Best Deals</h3>
            <p className="text-sm text-muted-foreground mt-1">Direct source products giving you unmatched market prices.</p>
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Explore Categories</h2>
              <p className="text-sm text-muted-foreground mt-1">Find the best selection tailormade to your taste</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((cat) => {
              const displaySlug = typeof cat === 'object' ? cat.slug : cat;
              const displayName = typeof cat === 'object' ? cat.name : cat;
              return (
                <Link
                  key={displaySlug}
                  href={`/products/${displaySlug}`}
                  className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border/40 shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-bold truncate w-full text-foreground">{displayName}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Best Sellers</h2>
              <p className="text-sm text-muted-foreground mt-1">Customer favorites with highest ratings</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1">
              <span>Shop best sellers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                src={product.thumbnail}
                name={product.title}
                desc={product.description}
                price={product.price}
                rating={product.rating}
                discountPercentage={product.discountPercentage}
                onClick={() => router.push(`/products/${product.category}/${product.slug}`)}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
