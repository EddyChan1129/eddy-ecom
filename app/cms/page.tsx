"use client";

import { uploadImage } from "@/lib/actions/product.action";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { useState } from "react";
import { deleteImageFromCloudinary } from "@/lib/actions/product.action";

interface UploadedImage {
  public_id: string;
  version: number;
  signature: string;
}

const categories = ["Food", "Drink", "Snacks", "Health"]; // example
const defaultTags = ["vegan", "spicy", "cold", "limited"];

export default function UploadWidget() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleRemoveImage = async (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== publicId));
    await deleteImageFromCloudinary(publicId);
  };

  return (
    <form action={uploadImage} className="flex flex-col gap-4">
      {/* Name */}
      <label>
        Name
        <input
          name="name"
          type="text"
          required
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Description */}
      <label>
        Description
        <textarea
          name="description"
          required
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Price */}
      <label>
        Price
        <input
          name="price"
          type="number"
          required
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Category */}
      <label>
        Category
        <select name="category" required className="block w-full border p-2 rounded">
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      {/* Tags */}
      <label>
        Tags (hold Ctrl to select multiple)
        <select
          name="tags"
          multiple
          className="block w-full border p-2 rounded h-24"
        >
          {defaultTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>

      {/* inStock + inSale */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="inStock" />
          In Stock
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="inSale" />
          On Sale
        </label>
      </div>

      {/* Upload Images */}
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
        signatureEndpoint="/update-photo"
      >
        {({ open }) => (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload Image(s)
          </button>
        )}
      </CldUploadWidget>

      {/* Preview Images */}
      <div className="flex gap-4 flex-wrap justify-center">
        {images.map((img) => (
          <div key={img.public_id} className="relative w-32 h-32">
            <CldImage
              src={img.public_id}
              width={300}
              height={300}
              alt="preview"
              priority
              className="h-32 w-auto rounded object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(img.public_id)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-2 py-1"
            >
              ✕
            </button>
            <input type="hidden" name="public_id[]" value={img.public_id} />
            <input type="hidden" name="version[]" value={img.version.toString()} />
            <input type="hidden" name="signature[]" value={img.signature} />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit All
      </button>
    </form>
  );
}
