"use client";
import ProductCard from "@/app/components/ProductCard";
import React, { useEffect, useState } from "react";

const page = () => {
  const [products, setProducts] = useState<any[] | undefined>();
  const [categories, setCategories] = useState<any[] | undefined>();

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

  return (
    <div className="min-h-screen  w-full flex flex-col p-20 bg-background text-heading ">
      <section className="w-full flex justify-center " >
        <h1 className="text-5xl py-10 ">Product Categories Available</h1>
        <hr />
      </section>

      {categories?.map((category) => (
        <section key={category.slug} className="w-full">
          <h1 className="py-5 text-4xl w-full">{category.name}</h1>
          <div className="py-10 px-20 w-full flex justify-between gap-8">
            {products
              ?.filter((product: any) => product.category === category.slug).slice(0,5)
              .map((product: any, index) => (
                
                <div className="flex flex-col" key={index}>
                  <ProductCard src={product.thumbnail}
                  name={product.title}
                  desc={product.description}
                  category={product.category}
                  rating={Math.round(product.rating)}/>
                </div>
              ))}
          </div>
          <hr />
        </section>
      ))}
    </div>
  );
};

export default page;
