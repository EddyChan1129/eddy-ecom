"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/actions/product.action";
import { deleteImageFromCloudinary } from "@/lib/actions/product.action";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { categories, defaultTags } from "@/const";

interface Props {
  productId: string;
}

export default function EditProductClient({ productId }: Props) {
  const router = useRouter();

  interface Image {
    public_id: string;
    version?: string | number;
    signature?: string;
  }

  interface ProductForm {
    name: string;
    description: string;
    price: number;
    images: Image[];
    category: string;
    tags: string[];
    inSale: boolean;
    inStock: boolean;
  }

  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
    images: [],
    category: "",
    tags: [],
    inSale: false,
    inStock: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { product: data } = await getProductById(productId);
      if (data) {
        setForm({
          name: data.name,
          description: data.description || "",
          price: data.price || 0,
          images: data.images || [],
          category: data.category || "",
          tags: data.tags || [],
          inSale: data.inSale,
          inStock: data.inStock,
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

  const handleTagChange = (tag: string) => {
    setForm((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  const handleSave = async () => {
    await updateProduct(productId, form);
    router.push("/products");
  };

  if (loading)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-amber-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
        <p className="text-sm font-medium">Loading product…</p>
      </div>
    );

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-white to-orange-100 px-6 py-10 shadow-lg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-6 top-6 h-28 w-28 rounded-full bg-orange-200/60 blur-3xl" />
          <div className="absolute right-4 bottom-6 h-32 w-32 rounded-full bg-amber-300/50 blur-3xl" />
        </div>
        <div className="relative space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-800">
            Edit Product
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Refresh details and keep your shelf current.
          </h1>
          <p className="text-base text-gray-700 sm:max-w-2xl">
            Update copy, pricing, inventory state, and imagery in one place.
            Changes reflect immediately across the storefront.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-xl backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute left-6 bottom-0 h-32 w-32 rounded-full bg-orange-200/40 blur-3xl" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-5 rounded-2xl border border-amber-100/80 bg-white/90 p-6 shadow-sm">
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-amber-900">
                Product name
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sesame Crunch"
                className="h-11 border-amber-200 focus-visible:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-semibold text-amber-900">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Share the flavor story, ingredients, and serve suggestions."
                rows={3}
                className="border-amber-200 focus-visible:ring-amber-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-amber-900">
                  Price (CAD)
                </Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: parseFloat(e.target.value || "0"),
                    })
                  }
                  placeholder="4.50"
                  className="h-11 border-amber-200 focus-visible:ring-amber-500"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-amber-900">
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm({ ...form, category: value })}
                >
                  <SelectTrigger className="h-11 w-full border-amber-200 focus:ring-amber-500">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-amber-900">
                Tags
              </Label>
              <div className="flex flex-wrap gap-2">
                {defaultTags.map((tag) => (
                  <Label
                    key={tag}
                    className="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-900 shadow-sm"
                  >
                    <Checkbox
                      checked={form.tags.includes(tag)}
                      onCheckedChange={() => handleTagChange(tag)}
                      className="border-amber-300"
                    />
                    <span>{tag}</span>
                  </Label>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                <Checkbox
                  id="sale"
                  checked={form.inSale}
                  onCheckedChange={(v) => setForm({ ...form, inSale: v === true })}
                  className="border-amber-300"
                />
                <label htmlFor="sale" className="text-sm font-semibold text-amber-900">
                  Feature on sale
                </label>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                <Checkbox
                  id="stock"
                  checked={form.inStock}
                  onCheckedChange={(v) => setForm({ ...form, inStock: v === true })}
                  className="border-amber-300"
                />
                <label htmlFor="stock" className="text-sm font-semibold text-amber-900">
                  In stock
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-amber-900">Images</p>
                <p className="text-xs text-gray-600">
                  Upload multiple shots—first image appears as the thumbnail.
                </p>
              </div>
              <CldUploadWidget
                uploadPreset="preset1"
                options={{
                  folder: "sample",
                  multiple: true,
                }}
                onSuccess={(result, _widget) => {
                  const info = result.info as {
                    public_id: string;
                    version: number;
                    signature: string;
                  };

                  setForm((prev) => ({
                    ...prev,
                    images: [
                      ...prev.images,
                      {
                        public_id: info.public_id,
                        version: info.version.toString(),
                        signature: info.signature,
                      },
                    ],
                  }));
                }}
                onQueuesEnd={(_result, { widget }) => {
                  widget.close();
                }}
                signatureEndpoint="/admin/upload-photo"
              >
                {({ open }) => (
                  <Button
                    type="button"
                    className="rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-700"
                    onClick={(e) => {
                      e.preventDefault();
                      open();
                    }}
                  >
                    Upload image(s)
                  </Button>
                )}
              </CldUploadWidget>
            </div>

            <div className="flex flex-wrap gap-4">
              {form.images.map((img) => (
                <div
                  key={img.public_id}
                  className="group relative h-32 w-32 overflow-hidden rounded-xl border border-amber-100 shadow-sm"
                >
                  <CldImage
                    src={img.public_id}
                    width={300}
                    height={300}
                    alt="upload image"
                    priority
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <Button
                    type="button"
                    onClick={() => handleDeleteImage(img.public_id)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white shadow"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-2 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Save changes
              </Button>
              <p className="text-xs text-gray-500">
                Double-check price, category, and hero image before publishing.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-6 shadow-inner">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Quick guidance
            </p>
            <ul className="space-y-3 text-sm text-gray-800">
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                Keep descriptions under 240 characters for clean product cards.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                Use 1200×1200 imagery for crisp storefront displays.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                Tag seasonal items to surface them in featured carousels.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                “In stock” drives add-to-cart visibility; toggle off when sold out.
              </li>
            </ul>
            <div className="rounded-xl border border-amber-200 bg-white/70 p-4 shadow-sm">
              <p className="text-sm font-semibold text-amber-900">Live preview</p>
              <p className="text-xs text-gray-700">
                First uploaded photo becomes the thumbnail. Remove and re-upload to reorder.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
