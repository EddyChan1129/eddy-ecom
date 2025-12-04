interface User {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "user"; // ✅ 加入這行，optional string enum
  phone?: string;
  location?: string;
  pickupPreference?: "pickup" | "delivery" | "undecided";
  marketingOptIn?: boolean;
  createdAt?: string;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  pickupPreference: "pickup" | "delivery" | "undecided";
  marketingOptIn?: boolean;
}

type FormType = "sign-in" | "sign-up";

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   images?: {
//     public_id: string;
//     version?: string; // Optional: 如果你想用 Cloudinary 的 version control
//     format?: string; // Optional: 如有需要知道是 jpg / webp 等
//   }[];
// }

interface Product {
  id: string;
  name: string;
  description: string;
  category: string | null; // Recommend others, checkbox sorting
  price: number;
  images?: {
    public_id: string;
    version?: string; // Optional: 如果你想用 Cloudinary 的 version control
    format?: string; // Optional: 如有需要知道是 jpg / webp 等
  }[];
  tags?: string[] | null;
  inStock: boolean; // Recommend others, checkbox sorting
  inSale: boolean; // Recommend others, checkbox sorting
  createdAt?: string; // Optional: 如果你想知道產品的創建時間
  updatedAt?: string; // Optional: 如果你想知道產品的更新時間
}
