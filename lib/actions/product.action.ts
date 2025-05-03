"use server";

import { db } from "@/firebase/admin";
import { redirect } from "next/navigation";
import cloudinary from "cloudinary";




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

// Get products from db
export async function getProducts(): Promise<Product[]> {
  const snapshot = await db.collection("products").get();
  if (snapshot.empty) return [];

  const productList = snapshot.docs.map((doc) => {
    const data = doc.data();

    // ✅ Filter 掉 signature 唔啱嘅圖片
    const images = (data.images || []).filter((img: any) => {
      const expectedSig = cloudinary.v2.utils.api_sign_request(
        {
          public_id: img.public_id,
          version: img.version,
        },
        process.env.CLOUDINARY_API_SECRET!
      );
      return expectedSig === img.signature;
    });

    // ✅ 唔再轉 URL，只 pass public_id 等 metadata
    return {
      id: doc.id,
      ...data,
      images: images.map((img: any) => ({
        public_id: img.public_id,
        version: img.version,
        format: img.format,
      })),
    };
  });

  return productList as Product[];
}

// Get Product by id
export async function getProductById(id: string): Promise<Product | null> {
  const productDoc = await db.collection("products").doc(id).get();
  if (!productDoc.exists) return null;

  const data = productDoc.data();

  const images = (data?.images || []).filter((img: any) => {
    const expectedSig = cloudinary.v2.utils.api_sign_request(
      {
        public_id: img.public_id,
        version: img.version,
      },
      process.env.CLOUDINARY_API_SECRET!
    );
    return expectedSig === img.signature;
  });

  return {
    id: productDoc.id,
    ...data,
    images, // ✅ 保留 public_id, version 等原始資料
  } as Product;
}



export const updateProduct = async (id: string, data: any) => {
  const ref = db.collection("products").doc(id); // ✅ Admin SDK 寫法
  await ref.update(data);
};

export const deleteProduct = async (id: string) => {
  const ref = db.collection("products").doc(id); // ✅ Admin SDK 寫法
  await ref.delete();
};

export const deleteImageFromCloudinary = async (publicId: string) => {

  cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    console.log("✅ Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary delete failed:", error);
    throw error;
  }
};
