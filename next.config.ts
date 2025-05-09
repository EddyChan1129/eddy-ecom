import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next.config.js
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "res.cloudinary.com",
  //       pathname: "/**",
  //     },
  //   ],
  // },
  images: {
    domains: ["res.cloudinary.com"], // ✅ 加 Cloudinary 網域
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
