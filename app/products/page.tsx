// app/products/page.tsx
import { isAdmin } from "@/lib/actions/auth.action";
import { getProducts } from "@/lib/actions/product.action";
import { ProductList } from "@/components/product-list";

// app/products/page.tsx

// app/products/page.tsx

export default async function ProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const category =
    typeof searchParams.category === "string" ? searchParams.category : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "";

  const { products } = await getProducts({
    category,
    sortOption: sort,
    limit: 1000,
  });

  const isAdminLogin = await isAdmin();

  return <ProductList products={products} isAdmin={isAdminLogin} />;
}
