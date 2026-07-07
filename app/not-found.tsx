import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="h-full w-full bg-background flex justify-center items-center flex-col gap-10">
      <div className="flex flex-col gap-2 justify-center text-text-muted  items-center">
        <h1 className="text-6xl pb-4 text-heading">4 0 4</h1>
        <h1 className="text-xl md:4xl">Oops! Wandered offtrack?</h1>

      <p className="text-xl">Return back to the store!</p>
        </div>
      <div className="flex gap-5">
        <Link
          href="/"
          className="py-2 px-4 bg-background hover:bg-surface font-semibold rounded-lg text-primary border-1 border-border "
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          className="py-2 px-4 bg-primary rounded-lg font-semibold text-surface border-1 border-border
        hover:bg-primary-hover "
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
