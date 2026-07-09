"use client";

import React, { useState } from "react";

type GalleryProps = {
  images: string[];
  thumbnail: string;
};

export default function ProductImageGallery({ images, thumbnail }: GalleryProps) {
  const [selectedImg, setSelectedImg] = useState<string>(images?.[0] || thumbnail);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0">
        {images?.map((img: string, index: number) => (
          <div key={index} className="shrink-0">
            <img
              className={`h-20 w-20 p-2 object-contain hover:bg-primary/10 bg-white border rounded-lg cursor-pointer transition-all duration-300 ${
                selectedImg === img ? "border-primary bg-primary/5" : "border-border"
              }`}
              src={img}
              onClick={() => setSelectedImg(img)}
              alt={`Thumbnail ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <div className="flex-1 bg-white border border-border rounded-2xl flex items-center justify-center p-4 aspect-square max-w-full md:max-w-[500px] lg:max-w-[600px] mx-auto">
        {selectedImg ? (
          <img
            className="max-h-full max-w-full object-contain"
            src={selectedImg}
            alt="image"
            loading="lazy"
          />
        ) : (
          <img
            className="max-h-full max-w-full object-contain"
            src={thumbnail}
            alt="image"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}
