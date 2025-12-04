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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { categories } from "@/const";
import { Input } from "./ui/input";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Label } from "./ui/label";
import { useAdminStore } from "@/store/auth-store";

interface ProductListProps {
  products: Product[];
  isAdmin: boolean;
}

const ITEMS_PER_PAGE = 8;

export const ProductList = ({ products, isAdmin }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [open, setOpen] = useState(false);
  const adminMode = useAdminStore((state) => state.adminMode);
  const showAdminTools = isAdmin && adminMode;

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term);
    const matchesCategory = selectedCategory
      ? product.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;

      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!products || products.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">No products found.</p>
    );
  }

  const productContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!productContainerRef.current) return;

    gsap.fromTo(
      productContainerRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
      },
    );
  }, [paginatedProducts]);

  return (
    <div className="">
      <div className="mb-6 flex justify-between items-center ">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="bg-gray-500 cursor-pointer text-white hover:bg-gray-600 transition-all duration-1000 attractive">
              Filter & Sort
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filter & Sort Products</SheetTitle>
              <SheetDescription>
                Choose how you want to sort the products.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-4 py-6 text-gray-500 ">
              <RadioGroup
                value={sortOption}
                onValueChange={(value) => {
                  setSortOption(value);
                  setOpen(false); // ✅ 揀完自動收起 Sheet
                }}
                className="flex"
              >
                <Label className="text-xs">Price:</Label>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-low" id="price-low" />
                  <label htmlFor="price-low" className="text-xs">
                    Low to High
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="price-high" id="price-high" />
                  <label htmlFor="price-high" className="text-xs">
                    High to Low
                  </label>
                </div>
              </RadioGroup>
              <Select
                name="category"
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1); // reset to page 1 on category change
                  setOpen(false); // ✅ 揀完自動收起 Sheet
                }}
              >
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // reset to page 1 when searching
                }}
                placeholder="Search products..."
                className="w-full max-w-sm rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 placeholder:text-xs"
              />
              <SheetClose asChild>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedCategory("");
                    setSortOption("");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="text-gray-500"
                >
                  Clear Filters
                </Button>
              </SheetClose>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button
                  type="button"
                  className="attractive uppercase tracking-widest cursor-pointer"
                >
                  Close
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <ul
        ref={productContainerRef}
        className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"
      >
        {paginatedProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} isAdmin={showAdminTools} />
          </li>
        ))}
      </ul>

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => goToPage(currentPage - 1)} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={index + 1 === currentPage}
                onClick={() => goToPage(index + 1)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => goToPage(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
