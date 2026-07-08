"use client";
import React, { useContext, useState } from "react";
import { Star, ShieldCheck, Truck, RotateCcw , User } from "lucide-react";
import { AppContext } from "@/app/context/appContext";
import ReviewCard from "@/app/components/ReviewCard";



type ProdcutProps = {
  catSlug?: string;
  proSlug?: string;
  product?: any[] | undefined;
};

const ProductPage = ({ catSlug, proSlug, product }: ProdcutProps) => {
  const selectedProd = product?.find((e) => e.slug === proSlug);
  const images = selectedProd.images;
  const [selectedImg, setSelectedImg] = useState<any>(images[0]);
  const prodContext = useContext(AppContext);
  const discountedPrice = (
    selectedProd.price -
    selectedProd.discountPercentage * (selectedProd.price / 100)
  ).toFixed(2);
  const reviews = selectedProd.reviews

  return (
    <div className="min-h-screen pt-20 md:pt-30 bg-background text-heading">
      <section className="w-full p-6 md:p-12 lg:p-20 bg-background flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0">
              {images.map((img: any, index: number) => (
                <div key={index} className="shrink-0">
                  <img
                    className={`h-20 w-20 p-2 object-contain hover:bg-primary/10 bg-white border rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedImg === img ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    src={img}
                    onClick={() => setSelectedImg(img)}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex-1 bg-white border border-border rounded-2xl flex items-center justify-center p-4 aspect-square max-w-full md:max-w-[500px] lg:max-w-[600px] mx-auto">
              {images ? (
                <img
                  className="max-h-full max-w-full object-contain"
                  src={selectedImg}
                  alt="image"
                />
              ) : (
                <img
                  className="max-h-full max-w-full object-contain"
                  src={selectedProd.thumbnail}
                  alt="image"
                />
              )}
            </div>
          </div>

          {/* badges */}
          <div className="flex flex-wrap gap-3 mt-2">
            {selectedProd.warrantyInformation && (
              <div className="flex items-center gap-2.5 bg-surface border border-border px-4 py-2 rounded-lg text-sm md:text-base font-medium text-heading">
                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-primary animate-pulse" />
                <span>{selectedProd.warrantyInformation}</span>
              </div>
            )}
            {selectedProd.shippingInformation && (
              <div className="flex items-center gap-2.5 bg-surface border border-border px-4 py-2 rounded-lg text-sm md:text-base font-medium text-heading">
                <Truck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                <span>{selectedProd.shippingInformation}</span>
              </div>
            )}
            {selectedProd.returnPolicy && (
              <div className="flex items-center gap-2.5 bg-surface border border-border px-4 py-2 rounded-lg text-sm md:text-base font-medium text-heading">
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                <span>{selectedProd.returnPolicy}</span>
              </div>
            )}
          </div>
        </div>

        {/* title */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-5xl font-bold flex flex-col gap-1">
              {selectedProd.title}
              <em className="text-lg md:text-2xl text-text-muted not-italic">
                {selectedProd.category}
              </em>
            </h1>

            <h2 className="w-full text-base md:text-lg text-text leading-relaxed">{selectedProd.description}</h2>
          </div>

          {/* rating */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 mb-1">
              {selectedProd.tags.map((tag: string, index: number) => (
                <div key={index} className="bg-card border border-primary/30 text-primary px-2.5 py-0.5 rounded-md text-sm font-medium tracking-[0.025em]" >
                  {tag}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      selectedProd.rating >= star
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm md:text-base text-text-muted">({selectedProd.rating})</p>
            </div>
          </div>

          {/* stock */}
          <div>
            {selectedProd.stock > 10 ? (
              <h1 className="text-sm md:text-base text-text-muted font-medium">{selectedProd.stock} in stock</h1>
            ) : selectedProd.stock == 0 ? (
              <h1 className="text-sm md:text-base text-gray-500 font-medium">Out of stock</h1>
            ) : (
              <h1 className="text-sm md:text-base text-red-600 font-semibold">
                Hurry only {selectedProd.stock} in stock!
              </h1>
            )}
          </div>

          {/* price */}
          <div className="text-3xl md:text-5xl font-bold w-full">
            {selectedProd.discountPercentage === 0 ? (
              <h1>
                {prodContext?.currency}
                {selectedProd.price}
              </h1>
            ) : (
              <div className="flex items-center gap-4">
                <h1 className="line-through text-gray-400 text-2xl md:text-3xl font-medium">
                  {prodContext?.currency}
                  {selectedProd.price}
                </h1>
                <h1 className="text-primary">
                  {prodContext?.currency}
                  {discountedPrice}
                </h1>
              </div>
            )}
          </div>

          {/* buttons */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <button className="flex-1 bg-background border-2 border-primary text-primary text-lg md:text-xl rounded-xl gap-3 px-6 py-3.5 hover:bg-primary hover:text-background transition-all duration-300 font-semibold flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shopping-cart"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Add to Cart
            </button>
            <button className="flex-1 bg-primary text-surface text-lg md:text-xl border-2 border-primary rounded-xl gap-3 px-6 py-3.5 hover:bg-primary-hover transition-all duration-300 font-semibold flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-check-big"
              >
                <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              Buy Now
            </button>
          </div>

          {/* product details */}
          <div className="mt-4 w-full">
            <h3 className="text-lg md:text-xl font-bold mb-3 text-heading">Product Specifications</h3>
            <div className="border border-border rounded-xl overflow-hidden bg-surface shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-background/50">
                    <th className="py-2.5 px-4 text-xs font-semibold tracking-wider text-text uppercase">Specification</th>
                    <th className="py-2.5 px-4 text-xs font-semibold tracking-wider text-text uppercase">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm">
                  {selectedProd.brand && (
                    <tr className="hover:bg-background/30 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-text-muted">Brand</td>
                      <td className="py-2.5 px-4 text-heading font-medium">{selectedProd.brand}</td>
                    </tr>
                  )}
                  {selectedProd.sku && (
                    <tr className="hover:bg-background/30 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-text-muted">SKU</td>
                      <td className="py-2.5 px-4 text-heading font-mono text-xs">{selectedProd.sku}</td>
                    </tr>
                  )}
                  {selectedProd.weight && (
                    <tr className="hover:bg-background/30 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-text-muted">Weight</td>
                      <td className="py-2.5 px-4 text-heading">{selectedProd.weight}g</td>
                    </tr>
                  )}
                  {selectedProd.dimensions && (
                    <tr className="hover:bg-background/30 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-text-muted">Dimensions</td>
                      <td className="py-2.5 px-4 text-heading">
                        {selectedProd.dimensions.width} × {selectedProd.dimensions.height} × {selectedProd.dimensions.depth} cm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="w-full px-4 md:px-12 lg:px-20 py-6 md:py-8 lg:py-14 bg-background">
        <h1 className="text-3xl sm:text-4xl md:text-5xl px-4 text-heading tracking-relaxed py-6 w-full text-center font-bold">Customer Reviews</h1>
        <div className="p-4 sm:p-6 flex w-full gap-4 bg-card rounded-lg border border-border shadow-xs">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="relative w-full flex items-center gap-2">
            <input type="text" className="text-text flex-1 focus:outline-none text-sm md:text-base" placeholder="Write about the product"/>
            <button className="not-italic font-semibold text-primary hover:text-primary-hover cursor-pointer text-xs md:text-sm tracking-wider uppercase">Post</button>
            <hr className="bg-heading w-full bottom-0 absolute opacity-20"/>
          </div>
        </div>
        <div className="flex flex-col mt-6 gap-4">
          {reviews.map((user:any, index:number) =>(
            <ReviewCard className="rounded-xl border border-border" key={index} rating={user.rating}
              comment={user.comment}
              name={user.reviewerName}
              date={user.date.slice(0,10)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
