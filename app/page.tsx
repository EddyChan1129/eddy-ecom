import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/carousel";
import { getProducts } from "@/lib/actions/auth.action";
import CldImageWrapper from "@/components/CldImageWrapper";

export default async function Home() {
  const products = await getProducts();
  const featuredImage = products[0]?.images?.[0];

  return (
    <div>
      <section className="rounded bg-neutral-100 py-8 sm:py-12">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-16 md:grid-cols-2">
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Welcome to My Ecommerce
            </h2>
            <p className="text-neutral-600">
              Discover the latest products at the best prices.
            </p>
            <Button
              asChild
              variant="default"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-black text-white"
            >
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>

          {featuredImage ? (
            <div className="relative w-[450px] h-[450px]">

              <CldImageWrapper
                src={featuredImage.public_id}
                alt="Featured Product"
                width={450}
                height={450}
                sizes="(max-width: 768px) 100vw, 450px"
                className="rounded-lg object-cover transition-transform duration-500 ease-in-out transform hover:scale-105"
                priority
              />

            </div>
          ) : (
            <div className="w-[450px] h-[450px] flex items-center justify-center bg-gray-300 text-gray-600 rounded">
              No image
            </div>
          )}
        </div>
      </section>

      <section className="py-8">
        <Carousel products={products.slice(0, 5)} />
      </section>
    </div>
  );
}
