
import { ProductList } from "@/components/product-list";
import { getProducts } from "@/lib/actions/auth.action";

export default async function ProductsPage() {

  const result = await getProducts();

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold leading-none tracking-tight text-foreground text-center mb-8">
        All Products
      </h1>
      <ProductList products={result} />
    </div> 
  );
}
