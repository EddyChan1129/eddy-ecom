import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/carousel";
import { getProducts } from "@/lib/actions/product.action";
import CldImageWrapper from "@/components/CldImageWrapper";
import Image from "next/image";

export const revalidate = 0;

export default async function Home() {
  const { products } = await getProducts({});
  const hasImageProducts = products.filter(
    (product) => product.images && product.images.length > 0,
  );
  // const featuredImage = products[0]?.images?.[0];
  const featuredImage = products.find((p) => p.images && p.images.length > 0)
    ?.images?.[0];

  return (
    <div>
      <section className="bg-neutral-100 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 items-center justify-items-center gap-12 px-6 sm:px-12">
          <div className="w-full max-w-md space-y-6 text-center md:text-left">
            <h2 className=" text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-4xl lg:text-6xl">
              Welcome <br /> <span className="main-color">MY BAGEL</span>
            </h2>
            <p className="sm:text-sm md:text-xs lg:text-2xl text-gray-600">
              Discover Canada’s most delicious bagels — freshly baked, perfectly
              chewy, and packed with flavor. Taste the difference with every
              bite.
            </p>
            <Button
              asChild
              variant="default"
              className="rounded-full attractive px-6 py-3 text-white hover:bg-blue-700 transition"
            >
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>

          <div className="relative sm:hidden md:flex w-full h-full md:h-[300px] lg:h-[500px] shadow-xl rounded-xl overflow-hidden bg-red-900">
            <Image
              src="/logo.png"
              alt="Featured Product"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              priority
            />
          </div>
        </div>
      </section>

      <section className="my-8">
        <Carousel products={hasImageProducts.slice(0, 5)} />
      </section>
    </div>
  );
}
