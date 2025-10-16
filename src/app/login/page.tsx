"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/redux/hook";
import { login } from "@/redux/features/authSlice";
import axios from "axios";

// 1️⃣ Zod Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

// 2️⃣ Infer TypeScript type
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 3️⃣ React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 4️⃣ Submit handler
  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    setLoading(true);

    try {
      const response = await axios.post("https://api.bitechx.com/auth", {
        email: data.email,
      });

      const token = response.data.token;

      // Store token + email in Redux + localStorage
      dispatch(login({ token, email: data.email }));

      // Redirect to products dashboard
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setApiError("Failed to login. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1821]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-2xl font-bold text-[#0D1821] mb-4 text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="mt-1 w-full text-black placeholder:text-[#4E6E5D] border p-2 rounded focus:ring-2 focus:ring-[#4E6E5D] outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* API Error */}
          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4E6E5D] text-white py-2 rounded hover:bg-[#AD8A64] transition cursor-pointer"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
