"use server";

import { stripe } from "@/lib/stripe";
import { CartItem } from "@/store/cart-store";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { db } from "@/firebase/admin";

export const checkoutAction = async (formData: FormData): Promise<void> => {
  const user = await getCurrentUser(); // ✅ 正確 async 調用
  if (!user) {
    redirect("/sign-in");
  }

  const itemsJson = formData.get("items") as string;
  const items = JSON.parse(itemsJson);

  const line_items = items.map((item: CartItem) => ({
    price_data: {
      currency: "CAD",
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const description = items
    .map((item: CartItem) => `${item.name} , qty: ${item.quantity}\n`)
    .join("\n");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    payment_intent_data: {
      description: description,
      statement_descriptor: "Eddy Ecommerce",
    },
    metadata: {
      userId: user.id,
      items: JSON.stringify(items),
    },
  });

  // if successful, redirect to checkout page and update firebase
  const orderRef = db.collection("orders").doc(session.id);
  await orderRef.set({
    email: user.email,
    userId: user.id,
    description: description,
    items,
    createdAt: new Date(),
    status: "pending",
  });
  redirect(session.url!);
};
