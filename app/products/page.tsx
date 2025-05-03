// app/products/page.tsx
import { isAuthenticated, isAdmin } from "@/lib/actions/auth.action";
import { getProducts } from "@/lib/actions/product.action";
import { ProductList } from "@/components/product-list";

export default async function ProductsPage() {
  const products = await getProducts();
  const isAdminLogin = await isAdmin();

  return <ProductList products={products} isAdmin={isAdminLogin} />;
}
