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
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
    <div>
      <h1 className="text-2xl font-bold text-center mb-8">Upload Product</h1>
      <form action={uploadProduct} className="flex flex-col gap-4 container mx-auto max-w-[300px]">
        {/* Name */}
        <Input
          name="name"
          type="text"
          required
          className="block w-full border p-2 rounded"
          placeholder="Product Name"
        />
        {/* Description */}
        <Textarea
          name="description"
          required
          className="block w-full border p-2 rounded"
          placeholder="Product Description"
          rows={3}
        />
        {/* Price */}
        <Input
          name="price"
          type="number"
          required
          className="block w-full border p-2 rounded"
          placeholder="Product Price"
        />
        {/* Category */}
        <Select name="category">
          <SelectTrigger className="w-full">
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

        {/* Tags */}
        <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Tags
        </Label>
        <div className="flex flex-wrap gap-2">
          {defaultTags.map((tag) => (
            <Label key={tag} className="flex items-center space-x-2">
              <Checkbox name="tags" value={tag} />
              <span className="text-sm">{tag}</span>
            </Label>
          ))}
        </div>

        {/* inSale */}
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" name="inSale" defaultChecked />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
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
          signatureEndpoint="/admin/upload-photo"
        >
          {({ open }) => (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                open();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload Image(s)
            </Button>
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
              <Button
                type="button"
                onClick={() => handleRemoveImage(img.public_id)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-2 py-1"
              >
                ✕
              </Button>
              <input type="hidden" name="public_id[]" value={img.public_id} />
              <input type="hidden" name="version[]" value={img.version.toString()} />
              <input type="hidden" name="signature[]" value={img.signature} />
            </div>
          ))}
        </div>
        {/* Submit Button */}
        <Button
          type="submit"
          className="bg-green-600"
        >
          Create Product
        </Button>
      </form>
    </div>
  );
}
