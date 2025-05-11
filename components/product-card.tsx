"use client";

import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/actions/product.action";
import { deleteImageFromCloudinary } from "@/lib/actions/product.action";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
}

export const ProductCard = ({ product, isAdmin }: ProductCardProps) => {
  // If the products is created within 0.1 days (2.4 hours) from now, it is considered new
  const isNew =
    new Date(product.createdAt ?? 0).getTime() >
    new Date().getTime() - 1000 * 60 * 60 * 24 * 1;

  const router = useRouter(); // ✅ 需要 router

  const handleDelete = async () => {
    try {
      for (const img of product.images || []) {
        await deleteImageFromCloudinary(img.public_id);
      }
      await deleteProduct(product.id);
      router.refresh(); // ✅ 或 router.push("/products") 如需跳轉
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete product.");
    }
  };

  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svgRef.current) return;

    const targets = svgRef.current.children;

    gsap.to(targets, {
      y: "5", // move up by 1px
      duration: 2.8,
      opacity: 0.9,
      repeat: -1,
      yoyo: true,
      stagger: 2,
      ease: "power2.inOut",
    });

    return () => {
      gsap.killTweensOf(targets); // clean up on unmount
    };
  }, []);

  return (
    <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0">
      <div className="relative  h-40 md:h-60 w-full">
        <div className="absolute inset-0 bg-gray-200 rounded-t-lg overflow-hidden flex items-center justify-center">
          {product.images?.[0]?.public_id && (
            <CldImage
              src={product.images?.[0]?.public_id}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              className="object-cover rounded-t-lg"
              alt={product.name}
              priority
            />
          )}
        </div>
        <span className="absolute top-1/2 left-1/2 sm:text-xs md:text-xl text-nowrap text-ellipsis overflow-hidden translate-[-50%] bg-white/50 px-2 py-3 rounded-md font-bold w-[8rem] text-center text-gray-600 uppercase tracking-wider hover:text-wrap">
          {product.name}
        </span>

        {isNew && (
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute text-yellow-700 top-[-10px] left-0 size-8 rounded-md w-10 h-12 p-1 animate-pulse"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
            />
          </svg>
        )}
        {isAdmin && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10 ">
            <Link href={`/admin/products/${product.id}`}>
              <Button variant="outline" className="bg-black/20 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                  <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                </svg>
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="bg-red-500/80 text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        {product.description && (
          <p className="text-gray-600 text-sm mb-1 text-nowrap text-ellipsis hover:text-wrap overflow-hidden ">
            {product.description}
          </p>
        )}
        <p className="text-lg mb-2 font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
        <Link href={`/products/${product.id}`}>
          <Button className=" bg-gray-500 font-bold text-white hover:bg-yellow-800 transition duration-1000 uppercase tracking-widest sm:text-xs md:text-sm cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
              />
            </svg>
            Detail
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
