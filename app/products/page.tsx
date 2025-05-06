// app/products/page.tsx
import { isAdmin } from "@/lib/actions/auth.action";
import { getProducts } from "@/lib/actions/product.action";
import { ProductList } from "@/components/product-list";

// app/products/page.tsx

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  const category = searchParams.category || "";
  const sort = searchParams.sort || "";


  const { products } = await getProducts({
    category,
    sortOption: sort,
    limit: 1000, // or remove limit completely
  });


  const isAdminLogin = await isAdmin();

  return (
    <ProductList
      products={products}
      isAdmin={isAdminLogin}
    />
  );
}
