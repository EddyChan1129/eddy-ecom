"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import cloudinary from "cloudinary";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

const cloudinaryConfig = cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };

    await setSessionCookie(idToken);
  } catch (error: any) {
    console.log("");

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get products from db
export async function getProducts(): Promise<Product[]> {
  const snapshot = await db.collection("products").get();
  if (snapshot.empty) return [];

  const productList = snapshot.docs.map((doc) => {
    const data = doc.data();

    // ✅ Filter 掉 signature 唔啱嘅圖片
    const images = (data.images || []).filter((img: any) => {
      const expectedSig = cloudinary.v2.utils.api_sign_request(
        {
          public_id: img.public_id,
          version: img.version,
        },
        process.env.CLOUDINARY_API_SECRET!
      );
      return expectedSig === img.signature;
    });

    // ✅ 唔再轉 URL，只 pass public_id 等 metadata
    return {
      id: doc.id,
      ...data,
      images: images.map((img: any) => ({
        public_id: img.public_id,
        version: img.version,
        format: img.format,
      })),
    };
  });

  return productList as Product[];
}

// Get Product by id
export async function getProductById(id: string): Promise<Product | null> {
  const productDoc = await db.collection("products").doc(id).get();
  if (!productDoc.exists) return null;

  const data = productDoc.data();

  const images = (data?.images || []).filter((img: any) => {
    const expectedSig = cloudinary.v2.utils.api_sign_request(
      {
        public_id: img.public_id,
        version: img.version,
      },
      process.env.CLOUDINARY_API_SECRET!
    );
    return expectedSig === img.signature;
  });

  return {
    id: productDoc.id,
    ...data,
    images, // ✅ 保留 public_id, version 等原始資料
  } as Product;
}


// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
