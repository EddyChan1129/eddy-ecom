import { ProductDetail } from "@/components/product-detail";
import { getProductById } from "@/lib/actions/product.action";
export default async function ProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const { product, suggestions } = await getProductById(id);

  if (!product) {
    return <div className="text-center text-red-500 mt-10">Product not found.</div>;
  }

  return <ProductDetail product={product} suggestions={suggestions}/>;
}
