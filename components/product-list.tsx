"use client";
import { useState } from "react";
import { ProductCard } from "./product-card";


interface ProductListProps {
  products: Product[];
  isAdmin: boolean;
}

export const ProductList = ({ products, isAdmin }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="mb-6 flex justify-center relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-sm rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} isAdmin={isAdmin} />
          </li>
        ))}
      </ul>
    </div>
  );
};
