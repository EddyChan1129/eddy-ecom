"use server";

import { db } from "@/firebase/admin";
import { redirect } from "next/navigation";

export async function uploadImage(formData: FormData) {
  const public_ids = formData.getAll("public_id[]") as string[];
  const versions = formData.getAll("version[]") as string[];
  const signatures = formData.getAll("signature[]") as string[];
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));


  if (public_ids.length === 0) {
    throw new Error("No images uploaded");
  }

  const images = public_ids.map((id, i) => ({
    public_id: id,
    version: versions[i],
    signature: signatures[i],
  }));

  // 新增一個 product，包含多張 image
  const result = await db.collection("products").add({
    name: name,
    description: description,
    price: price,
    images, // ✅ 存成陣列
    createdAt: new Date().toISOString(),
  });

  console.log("Product created:", result.id);

  redirect("/products"); // 回首頁
}
