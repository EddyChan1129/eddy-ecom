"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
type ProductPreview = Omit<Product, "description" | "tags" | "updatedAt">;

interface Props {
  product: Product;
  suggestions: ProductPreview[];
}


export const ProductDetail = ({ product, suggestions }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const [current, setCurrent] = useState<number>(0);

  const onAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images ? product.images[0].public_id : null,
      quantity: 1,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-center">
      {/* <div className="relative h-96 w-full md:w-1/2 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        {product.images && product.images[current] ? (
          <CldImage
            src={product.images[current].public_id || "sample/tbh38rpgtlcp5pat3kry"}
            alt={product.name}
            width={600}
            height={600}
            sizes="650px"
            className="transition duration-300 hover:opacity-90 object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-medium">
            No image provide</div>

        )}
        <Link href="/products" className="absolute top-0 left-0 "><Button className="cursor-pointer" >Back</Button></Link>
      </div> */}

      <Carousel className="relative w-full md:w-1/2 rounded-lg bg-gray-100">
        {product.images && product.images?.length > 0 ? (
          <div>
            <CarouselContent>
              {Array.from({ length: product.images?.length }).map((_, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <CldImage
                        src={product.images![index].public_id}
                        alt={product.name}
                        width={600}
                        height={600}
                        sizes="650px"
                        className="transition duration-300 hover:opacity-90 object-cover"
                        priority
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {(product.images?.length > 1) && <CarouselPrevious />}
            {product.images?.length > 1 && <CarouselNext />}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-medium">
            No image provide
          </div>
        )}
        <Link href="/products" className="absolute top-1 left-1 "><Button className="cursor-pointer rounded-e-none rounded-b-none rounded-s-md rounded-br-md" >Back</Button></Link>
      </Carousel>

      <div className="md:w-1/2 md:pl-20">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        {product.category && <p className="text-sm text-gray-500 mb-2">Category: {product.category}</p>}

        {product.tags && product.tags?.length > 0 && (
          <p className="text-sm text-gray-500 mb-2">
            Tags: {product.tags.join(", ")}
          </p>
        )}

        <p className="text-sm mb-2">
          {product.inStock ? (
            <span className="text-green-600 font-semibold">In Stock</span>
          ) : (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          )}
        </p>

        {product.inSale && (
          <p className="text-sm text-yellow-600 font-semibold mb-2">🔥 On Sale!</p>
        )}

        <p className="text-gray-700 mb-4">{product.description}</p>

        <p className="text-lg font-semibold text-gray-900 mb-4">
          ${product.price.toFixed(2)}
        </p>

        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => removeItem(product.id)}>
            –
          </Button>
          <span className="text-lg font-semibold">{quantity}</span>
          <Button onClick={onAddItem}>+</Button>
        </div>
        <Link href={"/checkout"}>
          <Button
            className="mt-6 bg-blue-600 text-white cursor-pointer"
          >
            Checkout
          </Button>
        </Link>

        {suggestions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-2">You May Also Like</h2>
            {suggestions.map((item) => (
              <div key={item.id} className="flex">
                <Link href={`/products/${item.id}`} className="border rounded-lg p-4">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-sm font-semibold text-gray-900 mb-4">
                    ${item.price}
                  </p>
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
                </Link>
              </div>

            ))}
          </div>
        )}


      </div>
    </div>
  );
};
