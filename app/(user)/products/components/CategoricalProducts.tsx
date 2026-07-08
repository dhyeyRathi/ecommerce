"use client"
import React, {useEffect, useState} from 'react'
import ProductCard from '@/app/components/ProductCard'
import Link from 'next/link'

type props = {
    
    products: any[] | undefined;
    slug: string;
    cat?: string;
}

const CategoricalProducts =  ({ products, slug, cat}: props) => {

    const filteredProds = products?.filter((product:any) => product.category === slug )
    
  return (
    <div className='min-h-screen w-full flex flex-col p-4 sm:p-10 md:p-20 bg-background pt-20 text-heading'>
        <section className="w-full flex justify-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl py-6 md:py-10 ">
          {cat} Products
        </h1>
        <hr />
      </section>


        <div className="py-6 px-4 md:py-10 md:px-20 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {filteredProds?.map((product: any, index) => (
              
                  <Link href={`/products/${slug}/${product.slug}`} className={`flex flex-col justify-center items-center `} key={index}>
                    <ProductCard src={product.thumbnail}
                      name={product.title}
                      desc={product.description}
                      price={product.price}
                      rating={Math.round(product.rating)} />
                  </Link>
            )
              )}
          </div>
      
    </div>
  )
}

export default CategoricalProducts
