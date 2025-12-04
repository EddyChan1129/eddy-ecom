"use client";

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminStore, useAuthStore } from "@/store/auth-store";
import { isAdmin } from "@/lib/actions/auth.action";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
    phone:
      type === "sign-up"
        ? z
            .string()
            .min(7, "Add a phone number so we can reach you at pickup.")
        : z.string().optional(),
    location:
      type === "sign-up"
        ? z
            .string()
            .min(2, "Tell us your neighborhood for smoother pickup.")
        : z.string().optional(),
    pickupPreference:
      type === "sign-up"
        ? z.enum(["pickup", "delivery", "undecided"])
        : z.enum(["pickup", "delivery", "undecided"]).optional(),
    marketingOptIn: z.boolean().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
      pickupPreference: "pickup",
      marketingOptIn: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      if (type === "sign-up") {
        const {
          name,
          email,
          password,
          phone,
          location,
          pickupPreference,
          marketingOptIn,
        } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
          phone: phone!,
          location: location!,
          pickupPreference: pickupPreference!,
          marketingOptIn: !!marketingOptIn,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        useAuthStore.getState().setLoggedIn(true);

        // ✅ 立即 check admin status
        const isAdminUser = await isAdmin();
        useAdminStore.getState().setIsAdmin(isAdminUser);

        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image
            src="/logo.png"
            alt="logo"
            height={320}
            width={380}
            className="h-auto rounded-full" // Tailwind 寫法
          />
        </div>

        <h2 className="text-3xl main-color font-bold text-center uppercase tracking-wide text-gray-700 md:text-4xl lg:text-6xl">
          {isSignIn ? "Sign In" : "Create an Account"}
        </h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="John Doe"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="xyz@example.com"
              type="email"
            />

          <FormField
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

            {!isSignIn && (
              <>
                <FormField
                  control={form.control}
                  name="phone"
                  label="Phone"
                  placeholder="+1 555 123 4567"
                  type="tel"
                />
                <FormField
                  control={form.control}
                  name="location"
                  label="Neighborhood / City"
                  placeholder="Toronto - Queen St. W"
                  type="text"
                />
                <div className="form-item space-y-2">
                  <label className="label" htmlFor="pickupPreference">
                    Pickup Preference
                  </label>
                  <select
                    id="pickupPreference"
                    className="input"
                    {...form.register("pickupPreference")}
                  >
                    <option value="pickup">In-store pickup</option>
                    <option value="delivery">Delivery</option>
                    <option value="undecided">Decide later</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-amber-600"
                    defaultChecked
                    {...form.register("marketingOptIn")}
                  />
                  Get product drops and pickup reminders
                </label>
              </>
            )}

            <Button
              className="btn cursor-pointer attractive uppercase tracking-wider"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isSignIn
                  ? "Signing in..."
                  : "Creating account..."
                : isSignIn
                  ? "Sign In"
                  : "Create an Account"}
            </Button>
            {!isSignIn && isSubmitting && (
              <p className="text-xs text-gray-500">Creating your profile...</p>
            )}
          </form>
        </Form>

        <p className="flex justify-between">
          {isSignIn ? (
            <span className="text-gray-500 font-thin italic">
              No account yet?
            </span>
          ) : (
            <span className=" flex w-1/2 text-gray-500 font-thin italic">
              Have an account already?
            </span>
          )}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? (
              <span className="inline-flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
                <u className="text-sm ml-1 text-gray-500 uppercase cursor-pointer">
                  Sign In
                </u>
              </span>
            ) : (
              <span className="inline-flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
                <u className="text-sm ml-1 text-gray-500 uppercase cursor-pointer">
                  Sign Up
                </u>
              </span>
            )}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
