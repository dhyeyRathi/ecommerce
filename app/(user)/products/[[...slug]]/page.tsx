"use client";
import ProductCard from "@/app/components/ProductCard";
import React, { use } from "react";
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
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 items-center gap-4 text-[10px] sm:text-xs lg:text-sm  text-heading lg:grid-cols-10 w-full p-4">
          {categories?.map((cat, index: number) => {
            return (
              <div key={index} className="h-8 rounded-full border-1 flex items-center tracking-[0.025em] justify-center border-border hover:bg-primary/10">
                <Link href={`#${cat.slug}`}>{cat.name}</Link>
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
          <div className="py-6 px-4 md:py-10 md:px-20 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {products
              ?.filter((product: any) => product.category === category.slug)
              .slice(0, 5)
              .map((product: any, index) => {
                let displayClass = "";
                if (index === 1) {
                  displayClass = "hidden sm:block";
                } else if (index >= 2 && index <= 3) {
                  displayClass = "hidden md:block";
                } else if (index === 4) {
                  displayClass = "hidden lg:block";
                }
                return (
                  <Link href={`/products/${category.slug}/${product.slug}`}
                    className={`flex flex-col justify-center items-center ${displayClass}`}
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
