import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/carousel";
import { getProducts } from "@/lib/actions/product.action";
import CldImageWrapper from "@/components/CldImageWrapper";

export default async function Home() {
  const products = await getProducts();
  // const featuredImage = products[0]?.images?.[0];
  const featuredImage = products.find(p => p.images && p.images.length > 0)?.images?.[0];

  return (
    <div>
      <section className="bg-neutral-100 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 items-center justify-items-center gap-12 px-6 sm:px-12">
          <div className="w-full max-w-md space-y-6 text-center md:text-left">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
              Welcome to <span className="text-blue-600">My Ecommerce</span>
            </h2>
            <p className="text-lg text-gray-600">
              Discover the latest products at unbeatable prices.
            </p>
            <Button
              asChild
              variant="default"
              className="rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
            >
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>

          {featuredImage ? (
            <div className="relative w-[320px] h-[380px] md:w-[350px] md:h-[450px] lg:w-[450px] lg:h-[500px] shadow-xl rounded-xl overflow-hidden">
              <CldImageWrapper
                src={featuredImage.public_id}
                alt="Featured Product"
                fill
                sizes="(max-width: 768px) 90vw, 450px"
                className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                priority
              />
            </div>
          ) : (
            <div className="w-[450px] h-[450px] flex items-center justify-center bg-gray-300 text-gray-600 rounded-lg">
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
