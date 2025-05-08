"use client";

import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-md text-center animate-fade-in">
        <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order is being processed.
        </p>
        <Link
          href="/products"
          className="inline-block rounded-lg bg-blue-600 text-white px-6 py-2 hover:bg-blue-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
