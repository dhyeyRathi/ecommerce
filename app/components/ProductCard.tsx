import React from "react";
import { Star } from "lucide-react";

type props = {
  src?: string;
  onClick?: () => void;
  name?: string;
  desc?: string;
  review?: any;
  brand?: string;
  category?: string;
  className?: string;
  rating?: number ;
};

const ProductCard = ({
  src,
  onClick,
  name,
  review,
  brand,
  category,
  desc,
  className,
  rating = 0,
}: props) => {




  return (
    <div className=" h-120 w-70 rounded-lg overflow-hidden flex flex-col p-4 group hover:bg-primary-hover/10 ">
      <img src={src} className="w-full h-60 group-hover:scale-105 transition-all duration-300" />
      <div className="overflow-hidden ">
        <h1 className="text-xl h-20 flex justify-center items-center text-center">
          {name}
        </h1>
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
        <p className="text-sm text-text-muted text-center">{desc}</p>
      </div>
    </div>
  );
};

export default ProductCard;
