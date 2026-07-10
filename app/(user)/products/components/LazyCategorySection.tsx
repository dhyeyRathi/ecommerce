"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";

type LazyCategorySectionProps = {
  category: any;
  products: any[];
  viewText: string;
};

export default function LazyCategorySection({
  category,
  products,
  viewText,
}: LazyCategorySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Starts loading 200px before the section is scrolled into view
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const categoryProducts = products.filter(
    (product: any) => product.category === category.slug
  );

  if (categoryProducts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id={category.slug}
      className="w-full py-20 min-h-[300px]"
    >
      <div className="flex w-full justify-between items-center px-4 md:px-10">
        <h2 className="py-5 text-2xl sm:text-3xl md:text-4xl font-bold">
          {category.name}
        </h2>
        <Link
          href={`/products/${category.slug}`}
          prefetch={false}
          className="text-sm sm:text-base md:text-xl py-5 hover:text-text-muted cursor-pointer"
        >
          {viewText}
        </Link>
      </div>

      <div className="py-6 px-4 md:py-10 md:px-12 xl:px-20 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 justify-items-center">
        {inView ? (
          categoryProducts.slice(0, 5).map((product: any, index: number) => {
            let displayClass = "";
            if (index === 1) displayClass = "hidden sm:block";
            else if (index === 2) displayClass = "hidden md:block";
            else if (index === 3) displayClass = "hidden lg:block";
            else if (index === 4) displayClass = "hidden xl:block";

            return (
              <Link
                href={`/products/${category.slug}/${product.slug}`}
                prefetch={false}
                className={`flex flex-col justify-center items-center w-full ${displayClass}`}
                key={product.id || index}
              >
                <ProductCard
                  src={product.thumbnail}
                  name={product.title}
                  desc={product.description}
                  price={product.price}
                  rating={Math.round(product.rating)}
                  discountPercentage={product.discountPercentage}
                />
              </Link>
            );
          })
        ) : (
          // Skeleton loader
          Array.from({ length: 5 }).map((_, i) => {
            let displayClass = "";
            if (i === 1) displayClass = "hidden sm:block";
            else if (i === 2) displayClass = "hidden md:block";
            else if (i === 3) displayClass = "hidden lg:block";
            else if (i === 4) displayClass = "hidden xl:block";

            return (
              <div
                key={i}
                className={`w-full max-w-[280px] h-[420px] rounded-lg bg-card border border-border/40 animate-pulse ${displayClass}`}
              />
            );
          })
        )}
      </div>
    </section>
  );
}
