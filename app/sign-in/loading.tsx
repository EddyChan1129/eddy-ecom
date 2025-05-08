"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Loading() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2000); // ⏱️ Wait at least 2 seconds

    if (!svgRef.current) return;

    // 🎯 Infinite rotate
    gsap.to(svgRef.current, {
      rotate: 360,
      duration: 2,
      ease: "linear",
      repeat: -1,
    });

    return () => {
      clearTimeout(timer);
      gsap.killTweensOf(svgRef.current);
    };
  }, []);

  // If you want to delay rendering the rest of the app (optional):
  if (!isReady) {
    return (
      <div className="text-center mt-10 text-gray-500 min-h-screen text-3xl grid place-items-center">
        <div className="flex justify-center items-center mb-4">
          <span className="mr-5">Loading...</span>
          <svg
            ref={svgRef}
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
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
      </div>
    );
  }

  return null; // or return the main page/component after loading
}
