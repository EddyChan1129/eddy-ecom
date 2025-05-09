import EditProductClient from "@/app/admin/products/[id]/EditProductClient";
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditProductClient productId={id} />;
}
