"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/actions/product.action";
import { deleteImageFromCloudinary } from "@/lib/actions/product.action";
import { CldImage, CldUploadWidget } from "next-cloudinary";

interface Props {
    productId: string;
}

export default function EditProductClient({ productId }: Props) {
    const router = useRouter();

    interface Image {
        public_id: string;
        url?: string;
        version?: string | number; // ✅ 支援 Cloudinary 返回的數字
        format?: string;
        signature?: string;
    }


    interface ProductForm {
        name: string;
        description: string;
        price: number;
        images: Image[];
    }

    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        price: 0,
        images: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductById(productId);
            if (data) {
                setForm({
                    name: data.name,
                    description: data.description || "",
                    price: data.price || 0,
                    images: data.images || [],
                });
            }
            setLoading(false);
        };
        fetchProduct();
    }, [productId]);

    const handleDeleteImage = async (publicId: string) => {
        await deleteImageFromCloudinary(publicId);
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img.public_id !== publicId),
        }));
    };


    const handleSave = async () => {
        await updateProduct(productId, form);
        router.push("/products");
    };


    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-8 max-w-xl mx-auto space-y-4">
            <input
                className="border p-2 w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
                className="border p-2 w-full"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
                type="number"
                className="border p-2 w-full"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
            />
            <div className="grid grid-cols-2 gap-2">
                {form.images.map((img) => (
                    <div key={img.public_id} className="relative">
                        <CldImage src={img.public_id} width={300} height={300} alt="upload image" priority className="w-full h-32 object-cover" />
                        <button
                            type="button"
                            onClick={() => handleDeleteImage(img.public_id)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
            <CldUploadWidget
                uploadPreset="preset1"
                options={{
                    folder: "sample",
                    multiple: true // ✅ 允許多圖上傳
                }}
                onSuccess={(result, _widget) => {
                    const info = result.info as {
                        public_id: string;
                        version: number;
                        signature: string;
                    };

                    console.log("Upload success:", info);

                    setForm((prev) => ({
                        ...prev,
                        images: [
                            ...prev.images,
                            {
                                public_id: info.public_id,
                                version: info.version.toString(), // ✅ 轉成 string
                                signature: info.signature,
                            },
                        ],
                    }));
                }}


                onQueuesEnd={(_result, { widget }) => {
                    widget.close();
                }}
                signatureEndpoint="/update-photo"
            >
                {({ open }) => (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            open();
                        }}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Upload Image(s)
                    </button>
                )}
            </CldUploadWidget>
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2">
                Save
            </button>
        </div>
    );
}
