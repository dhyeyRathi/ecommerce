import ProductCard from "@/app/components/ProductCard";
import React from "react";
import CategoricalProducts from "../components/CategoricalProducts";
import Link from "next/link";
import ProductPage from "../components/ProductPage";
import { notFound, redirect } from "next/navigation";
import { getProducts, getCategories } from "@/app/context/productContext";
import ClientScrollHandler from "../components/ClientScrollHandler";
import LazyCategorySection from "../components/LazyCategorySection";

type props = {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams?: Promise<{
    search?: string;
  }>;
};

const page = async ({ params, searchParams }: props) => {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams?.slug || [];
  const searchQuery = resolvedSearchParams?.search || "";
  const products = await getProducts();
  const categories = await getCategories();
  const view = "View All >>>";

  if (slug.length === 1) {
    const categorySlug = slug[0];
    const check = categories?.find((e: any) => e.slug === categorySlug);
    if (!check) return notFound();
    return <CategoricalProducts slug={categorySlug} products={products} cat={check.name} />;
  }

  if (slug.length === 2) {
    const categorySlug = slug[0];
    const productSlug = slug[1];
    const check = categories?.find((e: any) => e.slug === categorySlug);
    if (!check) return notFound();
    const check2 = products?.find((e: any) => e.slug === productSlug);
    if (!check2) return notFound();
    return <ProductPage catSlug={categorySlug} proSlug={productSlug} product={products} />;
  }

  if (slug.length > 2) {
    redirect('/products')
  }

  // Handle Search Query
  if (searchQuery.trim()) {
    const filteredProducts = products.filter((product: any) =>
      product.title.toLowerCase().startsWith(searchQuery.trim().toLowerCase())
    );

    return (
      <div className="min-h-screen w-full flex flex-col p-4 sm:p-10 md:p-20 bg-background pt-20 text-heading">
        <section className="w-full flex justify-center text-center flex flex-col">
          <h1 className="text-3xl sm:text-4xl md:text-5xl py-6 md:py-10">
            Search Results for &ldquo;{searchQuery}&rdquo;
          </h1>
          <hr />
        </section>

        {filteredProducts.length > 0 ? (
          <div className="py-6 px-4 md:py-10 md:px-12 xl:px-20 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 justify-items-center">
            {filteredProducts.map((product: any, index: number) => (
              <Link
                href={`/products/${product.category}/${product.slug}`}
                className="flex flex-col justify-center items-center w-full"
                key={index}
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
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted mb-4 lucide lucide-search-x"
            >
              <path d="m13.5 8.5-5 5" />
              <path d="m8.5 8.5 5 5" />
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-text-muted max-w-md">
              We couldn&apos;t find any products matching &ldquo;{searchQuery}&rdquo;. Try checking the spelling or using more general keywords.
            </p>
            <Link
              href="/products"
              className="mt-6 px-6 py-2.5 bg-primary text-surface font-semibold rounded-lg hover:bg-primary-hover transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col p-4 sm:p-10 md:p-20 bg-background pt-20 text-heading">
      <ClientScrollHandler />
      <section className="w-full flex justify-center text-center flex flex-col">
        <h1 className="text-3xl sm:text-4xl md:text-5xl py-6 md:py-10">
          Product Categories Available
        </h1>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center w-full p-4 text-xs md:text-sm text-heading">
          {categories?.map((cat: any, index: number) => {
            return (
              <div key={index} className="px-4 py-1.5 rounded-full border border-border flex items-center tracking-[0.025em] justify-center hover:bg-primary/10 transition-all duration-200 cursor-pointer">
                <Link href={`#${cat.slug}`} className="whitespace-nowrap">{cat.name}</Link>
              </div>
            )
          })}
        </div>
        <hr />
      </section>

      {categories?.map((category: any) => (
        <LazyCategorySection
          key={category.slug}
          category={category}
          products={products}
          viewText={view}
        />
      ))}
    </div>
  );
};

export default page;
