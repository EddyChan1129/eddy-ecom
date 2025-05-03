"use client";

import { uploadImage } from '@/lib/actions/product.action';
import { CldUploadWidget, CldImage } from 'next-cloudinary';
import { useState } from 'react';
import { deleteImageFromCloudinary } from '@/lib/actions/product.action';

interface UploadedImage {
  public_id: string;
  version: number;
  signature: string;
}

export default function UploadWidget() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleRemoveImage = async (publicId: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== publicId));
    // Remove cloudinary image if needed
    await deleteImageFromCloudinary(publicId);
  };

  return (
    <form action={uploadImage} method="POST" className="flex flex-col gap-4">
      {/* Basic fields */}
      <label>
        Name
        <input
          name="name"
          type="text"
          required
          className="block w-full border p-2 rounded"
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          required
          className="block w-full border p-2 rounded"
        />
      </label>
      <label>
        Price
        <input
          name="price"
          type="number"
          required
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Upload button */}
      <CldUploadWidget
        uploadPreset="preset1"
        options={{
          folder: "sample",
          multiple: true
        }}
        onSuccess={(result, widget) => {
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
        onQueuesEnd={(result, { widget }) => {
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

      {/* Image previews with delete buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        {images.map((img) => (
          <div key={img.public_id} className="relative w-32 h-32 bg-red-900">
            <CldImage
              src={img.public_id}
              width={300}
              height={300}
              alt="preview"
              priority
              className="h-32 w-auto rounded object-cover " // ✅ 加 w-auto
            />


            <button
              type="button"
              onClick={() => handleRemoveImage(img.public_id)}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded px-2 py-1"
            >
              ✕
            </button>

            {/* Hidden fields to submit */}
            <input type="hidden" name="public_id[]" value={img.public_id} />
            <input type="hidden" name="version[]" value={img.version.toString()} />
            <input type="hidden" name="signature[]" value={img.signature} />
          </div>
        ))}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Submit All
      </button>
    </form>
  );
}
