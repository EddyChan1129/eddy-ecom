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
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
      <Link href={`/products/${currentProduct.id}`}>
        <Card className="group relative overflow-hidden rounded-3xl border border-amber-100/80 bg-white shadow-xl shadow-amber-200/40 transition hover:-translate-y-1 hover:shadow-2xl">
          {currentProduct.images?.[0]?.public_id && (
            <div className="relative h-[360px] w-full sm:h-[420px]">
              <CldImage
                src={currentProduct.images[0].public_id}
                alt={currentProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 1100px"
                className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-transparent" />

          <CardContent className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-8 text-white">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em]">
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                Signature pick
              </span>
              <span className="rounded-full bg-amber-500/90 px-3 py-1 text-amber-950 shadow">
                ${currentProduct.price.toFixed(2)}
              </span>
            </div>
            <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {currentProduct.name}
            </CardTitle>
            <p className="text-sm sm:text-base text-amber-50/90">
              Freshly baked, chef-tested, and ready for pickup. Tap to see
              details and toppings.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex items-center justify-center rounded-full bg-white text-gray-900 px-4 py-2 text-xs font-semibold shadow-lg transition duration-300 group-hover:bg-amber-100 group-hover:text-amber-900">
                View product
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>

      <div className="mt-4 flex items-center justify-center gap-2">
        {products.map((_, index) => {
          const active = index === current;
          return (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                active
                  ? "w-6 bg-amber-600 shadow-amber-300 shadow-sm"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View ${products[index].name}`}
              type="button"
            />
          );
        })}
      </div>
    </div>
  );
};
