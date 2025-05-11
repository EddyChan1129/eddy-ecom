"use client";

import Link from "next/link";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  isAdmin as authAdmin,
  isAuthenticated,
  signOut,
} from "@/lib/actions/auth.action";
import { useAuthStore, useAdminStore } from "@/store/auth-store"; // ✅ 引入
import Image from "next/image";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const isLogin = useAuthStore((state) => state.isLoggedIn);
  const setIsLogin = useAuthStore((state) => state.setLoggedIn);
  const isAdmin = useAdminStore((state) => state.isAdmin);
  const setIsAdmin = useAdminStore((state) => state.setIsAdmin);

  // Check login & admin status once on mount
  useEffect(() => {
    const checkUser = async () => {
      const login = await isAuthenticated();
      setIsLogin(login);

      const adminResult = await authAdmin();
      setIsAdmin(adminResult); // ✅ 記錄 admin 狀態
    };

    checkUser();
  }, []);

  const logout = async () => {
    await signOut();
    setIsLogin(false); // ✅ 即時登出
    setIsAdmin(false); // ✅ 清除 admin 狀態
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4 ">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-gray-800 hover:text-blue-600 transition overflow-hidden flex items-center"
        >
          <Image
            src="/favicon.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full "
          />
        </Link>
        <div className="hidden md:flex items-center  md:space-x-4 lg:space-x-10 text-gray-700 md:text-sm lg:text-xl font-medium uppercase tracking-wider">
          <Link
            href="/"
            className="hover:text-blue-600 hover:underline transition"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="hover:text-blue-600 hover:underline transition"
          >
            Products
          </Link>
          <Link
            href="/checkout"
            className="hover:text-blue-600 hover:underline transition"
          >
            Checkout
          </Link>
          {isAdmin && (
            <Link
              href="/admin/cms"
              className="text-blue-700 main-color font-semibold hover:underline"
            >
              CMS
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {!isLogin ? (
            <Link href="/sign-in" className="hidden md:block">
              <Button className="text-xs rounded-xl attractive hover:bg-blue-700 text-white px-4 transition uppercase">
                Login
              </Button>
            </Link>
          ) : (
            <Button
              onClick={logout}
              className="text-xs hidden md:block rounded-full attractive hover:bg-gray-700 text-white px-4 transition uppercase"
            >
              Logout
            </Button>
          )}

          <Link href="/checkout" className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-inner">
          <ul className="flex flex-col p-6 space-y-4 text-gray-800 text-base">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-blue-600"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/checkout"
                className="hover:text-blue-600"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                Checkout
              </Link>
            </li>
            {!isLogin ? (
              <li>
                <Link
                  href="/sign-in"
                  className="main-color font-semibold"
                  onClick={() => setMobileOpen((prev) => !prev)}
                >
                  Login
                </Link>
              </li>
            ) : (
              <li>
                <Button
                  className="font-semibold attractive"
                  onClick={() => {
                    setMobileOpen((prev) => !prev);
                    logout();
                  }}
                >
                  Logout
                </Button>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  href="/admin/cms"
                  className="font-semibold main-color attractive"
                  onClick={() => setMobileOpen(false)}
                >
                  CMS
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};
