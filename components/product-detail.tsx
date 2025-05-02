"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart-store";
import { CldImage } from "next-cloudinary";

interface Product {
  id: string;
  name: string;
  description?: string;
  images?: { public_id: string }[];
  price: number;
}

interface Props {
  product: Product;
}

export const ProductDetail = ({ product }: Props) => {
  const { items, addItem, removeItem } = useCartStore();
  const price = product.price;
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const length = product.images?.length || 1;
      setCurrent((prev) => (prev + 1) % length);
    }, 1000);

    return () => clearInterval(interval);
  }, [product.images?.length]);

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
      {product.images && product.images[current] && (
        <div className="relative h-96 w-full md:w-1/2 rounded-lg overflow-hidden">
          <CldImage
            src={product.images[current].public_id}
            alt={product.name}
            width={960}
            height={600}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="transition duration-300 hover:opacity-90 object-cover"
            priority
          />
        </div>
      )}
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        {product.description && (
          <p className="text-gray-700 mb-4">{product.description}</p>
        )}
        {price && (
          <p className="text-lg font-semibold text-gray-900">
            ${price.toFixed(2)}
          </p>
        )}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => removeItem(product.id)}>
            –
          </Button>
          <span className="text-lg font-semibold">{quantity}</span>
          <Button onClick={onAddItem}>+</Button>
        </div>
      </div>
    </div>
  );
};
