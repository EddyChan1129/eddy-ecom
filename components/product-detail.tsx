"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

type ProductPreview = Omit<Product, "description" | "tags" | "updatedAt">;

interface Props {
  product: Product;
  suggestions: ProductPreview[];
}

export const ProductDetail = ({ product, suggestions }: Props) => {
  const router = useRouter();

  const { items, addItem, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images ? product.images[0].public_id : null,
      quantity: 1,
    });
  };

  const handleCheckout = () => {
    if (!product.inStock) return;
    // navigate to the checkout page using useRouter or any other method
    router.push("/checkout");
  };
  return (
    <div className=" container mx-auto px-8 flex flex-col lg:flex-row gap-8 justify-center items-center">
      <Carousel className="relative w-full lg:w-1/2 rounded-lg">
        {product.images && product.images?.length > 0 ? (
          <div>
            <CarouselContent>
              {Array.from({ length: product.images?.length }).map(
                (_, index) => (
                  <CarouselItem key={index}>
                    <Card className="p-0  border-none">
                      <CardContent className="flex aspect-square border-none items-center justify-center p-0 ">
                        <CldImage
                          src={product.images![index].public_id}
                          alt={product.name}
                          width={600}
                          height={600}
                          sizes="650px"
                          className="w-full transition duration-300 hover:opacity-90 object-cover relative"
                          priority
                        />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ),
              )}
            </CarouselContent>
            {product.images?.length > 1 && <CarouselPrevious />}
            {product.images?.length > 1 && <CarouselNext />}
            {!product.inStock && (
              <span className="absolute top-1/2 left-0 w-full -translate-y-1/2 bg-black/50 text-white text-center font-semibold py-2 uppercase tracking-widest text-3xl">
                No Stock
              </span>
            )}

            {product.inSale && (
              <span className="attractive animate-pulse text-white text-xs font-bold px-3 py-2 shadow-lg rounded-bl-2xl  uppercase tracking-wider w-1/3 text-center absolute top-0 right-0 ">
                On Sale
              </span>
            )}

            {
              <svg
                onClick={() => {
                  const element = document.querySelector("#product-detail");
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="md:hidden sm:inline-block size-6 absolute -bottom-4 left-1/2 translate-x-[-50%] translate-y-[50%] text-gray-500 animate-bounce duration-3000"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                />
              </svg>
            }
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-medium">
            No image provide
          </div>
        )}
        <Link
          href="/products"
          className="absolute top-0 left-0 bg-black/50 text-white rounded-br-2xl p-2 hover:text-gray-700 hover:bg-gray-200 transition duration-3000"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 26 26"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
            />
          </svg>
        </Link>
      </Carousel>

      <div className="md:w-1/2 md:pl-20" id="product-detail">
        <div className="relative flex items-center">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        </div>

        {product.category && (
          <p className="inline-block uppercase w-1/2 text-center my-5 px-3 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-700 text-sm font-medium shadow-sm hover:bg-amber-100 transition-colors duration-200">
            {product.category}
          </p>
        )}

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full shadow-sm hover:bg-gray-200 transition-colors duration-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-gray-700 my-6">{product.description}</p>

        <p className="text-lg font-semibold text-gray-900 mb-4">
          ${product.price.toFixed(2)}
        </p>

        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => removeItem(product.id)}>
            –
          </Button>
          <span className="text-lg font-semibold ">{quantity}</span>
          <Button onClick={onAddItem}>+</Button>
        </div>

        <Button
          onClick={() => handleCheckout()}
          className="mt-6 uppercase font-bold tracking-wider  attractive  text-white cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="sm:size-4 size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
            />
          </svg>
          Checkout
        </Button>

        {suggestions.length > 0 && (
          <div className="mt-8 ">
            <h2 className="text-lg font-bold mb-2">You May Also Like</h2>
            <div className="flex gap-3 flex-wrap">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="border rounded-lg h-16 overflow-hidden flex shrink-0 relative"
                >
                  {item.images && item.images[0] && (
                    <CldImage
                      src={item.images[0].public_id}
                      alt={item.name}
                      width={100}
                      height={100}
                      sizes="300px"
                      className="transition duration-300 hover:opacity-90 object-cover"
                    />
                  )}
                  <p className="absolute top-[2rem] left-[50%] translate-[-50%] text-xs bg-gray-500/50 p-1 text-white w-full text-center uppercase tracking-tight font-bold">
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
