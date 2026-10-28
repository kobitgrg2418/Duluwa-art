"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, ArrowUpRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back to Duluwa Art!");
      router.push("/profile");
    } catch (err: any) {
      toast.error(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfcfc] text-black min-h-screen">
      <RevixNavbar />

      <section className="py-20 px-8 max-w-[600px] mx-auto">
        <div className="border-b border-black/10 pb-8 mb-10 text-center">
          <span className="text-xs uppercase tracking-widest text-black/50 font-semibold block mb-2">
            Collector Portal
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-black/60 text-sm">Sign in to track orders, saved works, and custom commissions.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="you@domain.com"
              className="w-full px-4 py-3.5 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-black/70">
                Password
              </label>
              <Link href="/contact" className="text-xs text-black/50 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rx-btn rx-btn-black w-full py-4 text-sm"
          >
            {loading ? "Signing In..." : "Sign In to Account"}
          </button>

          <div className="text-center pt-4">
            <span className="text-xs text-black/60">Don&apos;t have an account? </span>
            <Link href="/register" className="text-xs font-bold text-black underline">
              Create an Account
            </Link>
          </div>
        </form>
      </section>

      <RevixFooter />
    </div>
  );
}
