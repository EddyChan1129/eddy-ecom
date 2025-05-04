"use server";

import { db } from "@/firebase/admin";
import { redirect } from "next/navigation";
import { cloudinary } from "@/lib/cloudinary";



export async function uploadProduct(formData: FormData) {
  const public_ids = formData.getAll("public_id[]") as string[];
  const versions = formData.getAll("version[]") as string[];
  const signatures = formData.getAll("signature[]") as string[];

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const category = formData.get("category")  as string;

  const tags = formData.getAll("tags")  as string[]
  const inSale = formData.get("inSale") !== null;

  if (public_ids.length === 0) {
    throw new Error("No images uploaded");
  }

  const images = public_ids.map((id, i) => ({
    public_id: id,
    version: versions[i],
    signature: signatures[i],
  }));

  const ref = db.collection("products").doc(); // 先 reserve ID
  const productWithId: Product = {
    id: ref.id,
    name,
    description,
    price,
    category: category.length > 0 ? category : null, // 如果沒有 category，就設為 null
    tags: tags.length > 0 ? tags : null, // 如果沒有 tags，就設為 null
    inStock: true,
    inSale,
    images,
    createdAt: new Date().toISOString(),
  };

  await ref.set(productWithId); // 用 set() 放全個 object，包括 id

  redirect("/products");
}

// Get products from db
export async function getProducts(): Promise<Product[]> {
  const snapshot = await db.collection("products").get();
  if (snapshot.empty) return [];

  const productList = snapshot.docs.map((doc) => {
    const data = doc.data();

    // ✅ Filter 掉 signature 唔啱嘅圖片
    const images = (data.images || []).filter((img: any) => {
      const expectedSig = cloudinary.utils.api_sign_request(
        {
          public_id: img.public_id,
          version: img.version,
        },
        process.env.CLOUDINARY_API_SECRET!
      );
      return expectedSig === img.signature;
    });

    // 只 pass public_id 等 metadata
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
    const expectedSig = cloudinary.utils.api_sign_request(
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

  try {
    const result = await cloudinary.uploader.destroy(publicId,{ invalidate: true });
    console.log("✅ Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary delete failed:", error);
    throw error;
  }
};
