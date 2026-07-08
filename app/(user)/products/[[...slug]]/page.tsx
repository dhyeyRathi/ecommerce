"use client";
import ProductCard from "@/app/components/ProductCard";
import React, { use, useEffect } from "react";
import CategoricalProducts from "../components/CategoricalProducts";
import Link from "next/link";
import ProductPage from "../components/ProductPage";
import { notFound, redirect } from "next/navigation";
import { useProducts } from "@/app/context/productContext";
import { navigate } from "next/dist/client/components/segment-cache/navigation";

type props = {
  params: Promise<{
    slug?: string[];
  }>;
};

const page = ({ params }: props) => {
  const resolvedParams = use(params);
  const slug = resolvedParams?.slug || [];
  const { products, categories, loading } = useProducts();
  const view = "View All >>>";

  useEffect(() => {
    if (!loading) {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      const scrollTimer = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
      return () => clearTimeout(scrollTimer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background text-heading">
        <p className="text-xl">Loading products...</p>
      </div>
    );
  }

  if (slug.length === 1) {
    const categorySlug = slug[0];
    const check = categories?.find((e) => e.slug === categorySlug);
    if (!check) return notFound();
    return <CategoricalProducts slug={categorySlug} products={products} cat={check.name} />;
  }






  if (slug.length === 2) {
    const categorySlug = slug[0];
    const productSlug = slug[1];
    const check = categories?.find((e) => e.slug === categorySlug);
    if (!check) return notFound();
    const check2 = products?.find((e) => e.slug === productSlug);
    if (!check2) return notFound();
    return <ProductPage catSlug={categorySlug} proSlug={productSlug} product={products} />;
  }


  if (slug.length > 2) {
    redirect('/products')
  }






  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-10 md:p-20 bg-background pt-20 text-heading">
      <section className="w-full flex justify-center text-center flex flex-col">
        <h1 className="text-3xl sm:text-4xl md:text-5xl py-6 md:py-10">
          Product Categories Available
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center w-full p-4 text-xs md:text-sm text-heading">
          {categories?.map((cat, index: number) => {
            return (
              <div key={index} className="px-4 py-1.5 rounded-full border border-border flex items-center tracking-[0.025em] justify-center hover:bg-primary/10 transition-all duration-200 cursor-pointer">
                <Link href={`#${cat.slug}`} className="whitespace-nowrap">{cat.name}</Link>
              </div>
            )
          })}
        </div>
        <hr />
      </section>

      {categories?.map((category) => (
        <section key={category.slug} id={category.slug} className="w-full py-20">

          <div className="flex w-full justify-between items-center px-4 md:px-10">
            <h1 className="py-5 text-2xl sm:text-3xl md:text-4xl">
              {category.name}
            </h1>
            <Link href={`/products/${category.slug}`} className="text-sm sm:text-base md:text-xl py-5 hover:text-text-muted cursor-pointer">
              {view}
            </Link>
          </div>
          <div className="py-6 px-4 md:py-10 md:px-12 xl:px-20 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 justify-items-center">
            {products
              ?.filter((product: any) => product.category === category.slug)
              .slice(0, 5)
              .map((product: any, index) => {
                let displayClass = "";
                if (index === 1) {
                  displayClass = "hidden sm:block";
                } else if (index === 2) {
                  displayClass = "hidden md:block";
                } else if (index === 3) {
                  displayClass = "hidden lg:block";
                } else if (index === 4) {
                  displayClass = "hidden xl:block";
                }
                return (
                  <Link href={`/products/${category.slug}/${product.slug}`}
                    className={`flex flex-col justify-center items-center w-full ${displayClass}`}
                    key={index}
                  >
                    <ProductCard
                      src={product.thumbnail}
                      name={product.title}
                      desc={product.description}
                      price={product.price}
                      rating={Math.round(product.rating)}
                    />
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default page;
