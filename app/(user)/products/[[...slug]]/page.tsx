"use client";
import ProductCard from "@/app/components/ProductCard";
import React, { useEffect, useState, use } from "react";
import CategoricalProducts from "../components/CategoricalProducts";
import Link from "next/link";
type props = {
  params: Promise<{
    slug?: string[];
  }>;
};
const page = ({ params }: props) => {
    const resolvedParams = use(params); 
  const slug = resolvedParams?.slug || [];
  const [products, setProducts] = useState<any[] | undefined>();
  const [categories, setCategories] = useState<any[] | undefined>();
  const view = "View All >>>";

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=194")
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setProducts(data.products);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);



  if (slug.length === 1) {
    const categorySlug = slug[0];
    return <CategoricalProducts slug={categorySlug} products={products} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-10 md:p-20 bg-background pt-20 text-heading">
      <section className="w-full flex justify-center text-center uppercase">
        <h1 className="text-3xl sm:text-4xl md:text-5xl py-6 md:py-10">
          Product Categories Available
        </h1>
        <hr />
      </section>

      {categories?.map((category) => (
        <section key={category.slug} className="w-full">
          <hr />
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
                  <div
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
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default page;
