"use client";

import { Card, CardContent, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";

interface Props {
  products: Product[];
}

export const Carousel = ({ products }: Props) => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (!products || products.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500">
        No products to display.
      </Card>
    );
  }

  const currentProduct = products[current];

  return (
    <Link href={`/products/${currentProduct.id}`}>
      <Card className="relative overflow-hidden rounded-lg shadow-md border-gray-300 p-0">
        {currentProduct.images?.[0]?.public_id && (
          <div className="relative h-80 w-full">
            <CldImage
              src={currentProduct.images[0].public_id}
              alt={currentProduct.name}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <CardContent className=" absolute w-full p-0 flex flex-col justify-center top-1/2 -translate-y-1/2">
          <div className="text-center bg-gray-500/60 p-3 uppercase tracking-widest">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              {currentProduct.name}
            </CardTitle>
            <p className="text-xl text-white">
              ${currentProduct.price.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
