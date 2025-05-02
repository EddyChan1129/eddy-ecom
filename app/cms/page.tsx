"use client";
import { uploadImage } from '@/lib/actions/product.action';
import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

export default function UploadWidget() {
  const [publicIds, setPublicIds] = useState<string[]>([]);
  const [versions, setVersions] = useState<number[]>([]);
  const [signatures, setSignatures] = useState<string[]>([]);

  return (
    <form action={uploadImage} method="POST" className="flex flex-col gap-4">
      <label htmlFor="name" className="text-sm font-medium text-gray-700">
        Name
        <input
          type="text"
          name="name"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product name"
          required
        />
      </label>
      <label htmlFor="description" className="text-sm font-medium text-gray-700">
        Description
        <textarea
          name="description"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product description"
          rows={4}
          required
        />
      </label>
      <label htmlFor="price" className="text-sm font-medium text-gray-700">
        Price
        <input
          type="number"
          name="price"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter product price"
          required
        />
      </label>
      <CldUploadWidget
        uploadPreset="preset1"
        options={{
          folder: "sample",
          multiple: true // ✅ 允許多圖上傳
        }}
        onSuccess={(result, widget) => {
          const info = result.info as {
            public_id: string;
            version: number;
            signature: string;
          };

          console.log("Upload result:", info);
          setPublicIds((prev) => [...prev, info.public_id]);
          setVersions((prev) => [...prev, info.version]);
          setSignatures((prev) => [...prev, info.signature]);
        }}
        onQueuesEnd={(result, { widget }) => {
          widget.close();
        }}
        signatureEndpoint="/upload-photo"
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

      {/* 👇 提交多張圖片的欄位 */}
      {publicIds.map((id, i) => (
        <div key={i}>
          <input type="hidden" name="public_id[]" value={id} />
          <input type="hidden" name="version[]" value={versions[i].toString()} />
          <input type="hidden" name="signature[]" value={signatures[i]} />
        </div>
      ))}

      <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Submit All
      </button>
    </form>
  );
}
