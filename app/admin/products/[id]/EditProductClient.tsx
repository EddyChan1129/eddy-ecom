"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductById, updateProduct } from "@/lib/actions/product.action";
import { deleteImageFromCloudinary } from "@/lib/actions/product.action";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      const data = await getProductById(productId);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4 flex flex-col">
      <Input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Product Name"
      />
      <Textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Product Description"
      />
      <Input
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
        placeholder="Product Price"
      />
      <Select
        value={form.category}
        onValueChange={(value) => setForm({ ...form, category: value })}
      >
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

      <Label>Tags</Label>
      <div className="flex flex-wrap gap-2">
        {defaultTags.map((tag) => (
          <Label key={tag} className="flex items-center space-x-2">
            <Checkbox
              checked={form.tags.includes(tag)}
              onCheckedChange={() => handleTagChange(tag)}
            />
            <span className="text-sm">{tag}</span>
          </Label>
        ))}
      </div>

      <Label className="flex items-center space-x-2">
        <Checkbox
          checked={form.inSale}
          onCheckedChange={(v) => setForm({ ...form, inSale: v === true })}
        />
        <span>On Sale</span>
      </Label>

      <Label className="flex items-center space-x-2">
        <Checkbox
          checked={form.inStock}
          onCheckedChange={(v) => setForm({ ...form, inStock: v === true })}
        />
        <span>In Stock</span>
      </Label>

      <div className="grid grid-cols-2 gap-2">
        {form.images.map((img) => (
          <div key={img.public_id} className="relative">
            <CldImage
              src={img.public_id}
              width={300}
              height={300}
              alt="upload image"
              priority
              className="w-full h-32 object-cover"
            />
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
          multiple: true,
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            Upload Image(s)
          </Button>
        )}
      </CldUploadWidget>

      <Button onClick={handleSave} className="bg-green-600 text-white px-4 py-2">
        Save
      </Button>
    </div>
  );
}
