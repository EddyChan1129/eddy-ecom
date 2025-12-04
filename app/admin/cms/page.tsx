"use client";

import { uploadProduct } from "@/lib/actions/product.action";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useState } from "react";
import { deleteImageFromCloudinary } from "@/lib/actions/product.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { categories, defaultTags } from "@/const";

interface UploadedImage {
  public_id: string;
  version: number;
  signature: string;
}

export default function UploadWidget() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleRemoveImage = async (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== publicId));
    await deleteImageFromCloudinary(publicId);
  };

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-white to-orange-100 px-6 py-10 shadow-lg">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-6 top-6 h-28 w-28 rounded-full bg-orange-200/60 blur-3xl" />
          <div className="absolute right-4 bottom-6 h-32 w-32 rounded-full bg-amber-300/50 blur-3xl" />
        </div>
        <div className="relative space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-800">
            CMS
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Create and launch products faster.
          </h1>
          <p className="text-base text-gray-700 sm:max-w-2xl">
            Keep the shelves stocked with fresh drops. Add details, set tags,
            and upload images with a few clicks—everything stays consistent and
            ready for the storefront.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-xl backdrop-blur">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="absolute left-6 bottom-0 h-32 w-32 rounded-full bg-orange-200/40 blur-3xl" />
        </div>
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            action={uploadProduct}
            className="flex flex-col gap-5 rounded-2xl border border-amber-100/80 bg-white/90 p-6 shadow-sm"
          >
            <div className="space-y-1">
              <Label className="text-sm font-semibold text-amber-900">
                Product name
              </Label>
              <Input
                name="name"
                type="text"
                required
                placeholder="Cinnamon Maple Twist"
                className="h-11 border-amber-200 focus-visible:ring-amber-500"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm font-semibold text-amber-900">
                Description
              </Label>
              <Textarea
                name="description"
                required
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
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="4.50"
                  className="h-11 border-amber-200 focus-visible:ring-amber-500"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-amber-900">
                  Category
                </Label>
                <Select name="category">
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
                    <Checkbox name="tags" value={tag} className="border-amber-300" />
                    <span>{tag}</span>
                  </Label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
              <Checkbox id="terms" name="inSale" defaultChecked className="border-amber-300" />
              <label
                htmlFor="terms"
                className="text-sm font-semibold text-amber-900"
              >
                Feature on sale
              </label>
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
                  setImages((prev) => [
                    ...prev,
                    {
                      public_id: info.public_id,
                      version: info.version,
                      signature: info.signature,
                    },
                  ]);
                }}
                onQueuesEnd={(_result, { widget }) => {
                  widget.close();
                }}
                signatureEndpoint="/admin/upload-photo"
              >
                {({ open }) => (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      open();
                    }}
                    className="rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-700"
                  >
                    Upload image(s)
                  </Button>
                )}
              </CldUploadWidget>
            </div>

            <div className="flex flex-wrap gap-4">
              {images.map((img) => (
                <div
                  key={img.public_id}
                  className="group relative h-32 w-32 overflow-hidden rounded-xl border border-amber-100 shadow-sm"
                >
                  <CldImage
                    src={img.public_id}
                    width={300}
                    height={300}
                    alt="preview"
                    priority
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveImage(img.public_id)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white shadow"
                  >
                    ✕
                  </Button>
                  <input type="hidden" name="public_id[]" value={img.public_id} />
                  <input type="hidden" name="version[]" value={img.version.toString()} />
                  <input type="hidden" name="signature[]" value={img.signature} />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                className="rounded-full bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-2 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Create product
              </Button>
              <p className="text-xs text-gray-500">
                Auto-saves run server-side when you submit—double-check details before publishing.
              </p>
            </div>
          </form>

          <div className="space-y-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-6 shadow-inner">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
              Tips
            </p>
            <ul className="space-y-3 text-sm text-gray-800">
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                Keep descriptions under 240 characters for best layout.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                Use 1200×1200 images for crisp storefront cards.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                Tag seasonal items so they appear in featured carousels.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-600" />
                Mark “Feature on sale” to surface deals on the home page.
              </li>
            </ul>
            <div className="rounded-xl border border-amber-200 bg-white/70 p-4 shadow-sm">
              <p className="text-sm font-semibold text-amber-900">Live preview</p>
              <p className="text-xs text-gray-700">
                Your first uploaded photo will be used as the product thumbnail. Rearrange by deleting and re-uploading if needed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
