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
  const category = formData.get("category") as string;

  const tags = formData.getAll("tags") as string[];
  const inSale = formData.get("inSale") !== null;

  const images =
    public_ids.length > 0
      ? public_ids.map((id, i) => ({
          public_id: id,
          version: versions[i],
          signature: signatures[i],
        }))
      : []; // 如果冇圖就空 array

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
export async function getProducts({
  category = "",
  searchTerm = "",
  sortOption = "",
  limit = 4,
  startAfterDoc = null,
}: {
  category?: string;
  searchTerm?: string;
  sortOption?: string;
  limit?: number;
  startAfterDoc?: FirebaseFirestore.DocumentSnapshot | null;
}) {
  let queryRef = db.collection("products").limit(limit);

  if (category) {
    queryRef = queryRef.where("category", "==", category);
  }

  if (sortOption === "price-low") {
    queryRef = queryRef.orderBy("price", "asc");
  } else if (sortOption === "price-high") {
    queryRef = queryRef.orderBy("price", "desc");
  } else {
    queryRef = queryRef.orderBy("createdAt", "desc");
  }

  if (startAfterDoc) {
    queryRef = queryRef.startAfter(startAfterDoc);
  }

  const snapshot = await queryRef.get();
  const products: Product[] = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      category: data.category,
      price: data.price,
      inStock: data.inStock,
      inSale: data.inSale,
      images: (data.images || []).map((img: any) => ({
        public_id: img.public_id,
        version: img.version,
        format: img.format,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];

  return { products, lastDoc };
}

// Get Product by id
export async function getProductById(
  id: string,
): Promise<{ product: Product | null; suggestions: Product[] }> {
  const productDoc = await db.collection("products").doc(id).get();
  if (!productDoc.exists) return { product: null, suggestions: [] };

  const data = productDoc.data();

  const images = (data?.images || []).filter((img: any) => {
    const expectedSig = cloudinary.utils.api_sign_request(
      {
        public_id: img.public_id,
        version: img.version,
      },
      process.env.CLOUDINARY_API_SECRET!,
    );
    return expectedSig === img.signature;
  });

  const product: Product = {
    id: productDoc.id,
    ...data,
    images,
  } as Product;

  // Get 3 similar products from same category (excluding current product)
  const snapshot = await db
    .collection("products")
    .where("category", "==", data?.category)
    .where("__name__", "!=", id)
    .limit(3)
    .get();

  const suggestions: Product[] = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      ...d,
      images: (d?.images || []).filter((img: any) => {
        const sig = cloudinary.utils.api_sign_request(
          {
            public_id: img.public_id,
            version: img.version,
          },
          process.env.CLOUDINARY_API_SECRET!,
        );
        return sig === img.signature;
      }),
    } as Product;
  });

  return { product, suggestions };
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
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    console.log("✅ Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("❌ Cloudinary delete failed:", error);
    throw error;
  }
};
