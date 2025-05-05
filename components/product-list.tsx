"use client";
import { useState } from "react";
import { ProductCard } from "./product-card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ProductListProps {
  products: Product[];
  isAdmin: boolean;
}

export const ProductList = ({ products, isAdmin }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "tag":
        return (a.tags?.[0] || "").localeCompare(b.tags?.[0] || "");
      case "category":
        return (a.category || "").localeCompare(b.category || "");
      default:
        return 0;
    }
  });

  return (
    <div className="">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Filter & Sort</Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Filter & Sort Products</SheetTitle>
            <SheetDescription>Choose how you want to sort the products.</SheetDescription>
          </SheetHeader>
          <div className="grid gap-2 px-4 py-6">
            <Button variant="outline" onClick={() => setSortOption("price-low")}>
              Sort by Price: Low to High
            </Button>
            <Button variant="outline" onClick={() => setSortOption("price-high")}>
              Sort by Price: High to Low
            </Button>
            <Button variant="outline" onClick={() => setSortOption("tag")}>
              Sort by Tag
            </Button>
            <Button variant="outline" onClick={() => setSortOption("category")}>
              Sort by Category
            </Button>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="button">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <div className="mb-6 flex justify-center relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-sm rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <ul className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
        {sortedProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} isAdmin={isAdmin} />
          </li>
        ))}
      </ul>
    </div>
  );
};
