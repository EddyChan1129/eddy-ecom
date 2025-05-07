import Link from "next/link";
import { CldImage } from "next-cloudinary";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/lib/actions/product.action";
import { deleteImageFromCloudinary } from "@/lib/actions/product.action";

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
}

export const ProductCard = ({ product, isAdmin }: ProductCardProps) => {

  // If the products is created within 0.1 days (2.4 hours) from now, it is considered new
  const isNew = new Date(product.createdAt?? 0).getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 0.1;

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

  return (
    <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0">
      <div className="relative  h-40 md:h-60 w-full">
        <div className="absolute inset-0 bg-gray-200 rounded-t-lg overflow-hidden flex items-center justify-center">
          {product.images?.[0]?.public_id &&
            <CldImage
              src={product.images?.[0]?.public_id}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              className="object-cover rounded-t-lg"
              alt={product.name}
              priority
            />}
        </div>
        <span className="absolute top-1/2 left-1/2 translate-[-50%] bg-white/50 px-2 py-3 rounded-full font-bold w-[8rem] text-center text-gray-600 uppercase tracking-wider">{product.name}</span>

        {isNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            New
          </span>
        )}
        {isAdmin && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10 ">
            <Link href={`/admin/products/${product.id}`}>
              <Button
                variant="outline"
                className="bg-black/20 text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
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
                handleDelete()
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clipRule="evenodd" />
              </svg>

            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        {product.description && (
          <p className="text-gray-600 text-sm mb-1">{product.description}</p>
        )}
        <p className="text-lg mb-2 font-semibold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
        <Link href={`/products/${product.id}`}>
          <Button className=" bg-black text-white">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
