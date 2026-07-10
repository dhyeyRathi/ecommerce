"use client";
import React, { useContext } from "react";
import { Star } from "lucide-react";
import { AppContext } from "../context/appContext";
import Image from "next/image";

type props = {
  src?: string;
  onClick?: () => void;
  name?: string;
  desc?: string;
  review?: any;
  brand?: string;
  price?: number;
  className?: string;
  rating?: number ;
  discountPercentage?: number;
};

const ProductCard = ({
  src,
  onClick,
  name,
  review,
  brand,
  price = 0,
  desc,
  className,
  rating = 0,
  discountPercentage = 0,
}: props) => {

const currency = useContext(AppContext)

  const hasDiscount = discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? (price - discountPercentage * (price / 100)).toFixed(2)
    : price;

  return (
    <div onClick={onClick} className="w-full max-w-[280px] min-h-[420px] md:min-h-[460px] rounded-lg overflow-hidden flex flex-col p-4 group hover:bg-primary-hover/10 transition-all duration-300 border border-transparent hover:border-border/50 cursor-pointer">
      <Image
        src={src || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}
        alt={name || "Product Image"}
        width={280}
        height={240}
        className="w-full h-48 md:h-60 object-contain group-hover:scale-105 transition-all duration-300"
      />
      <div className="overflow-hidden flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg md:text-xl h-20 flex justify-center items-center text-center font-medium line-clamp-2">
            {name}
          </h3>
          <div className="flex justify-center scale-90 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={
                  rating >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="line-through text-gray-400 text-base md:text-lg font-medium">
                  {currency?.currency || "$"}{price}
                </span>
                <span className="text-xl md:text-2xl text-primary font-bold">
                  {currency?.currency || "$"}{discountedPrice}
                </span>
              </>
            ) : (
              <span className="text-xl md:text-2xl text-heading font-bold">
                {currency?.currency || "$"}{price}
              </span>
            )}
          </div>
          <p className="text-xs md:text-sm text-text-muted text-center line-clamp-2 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
