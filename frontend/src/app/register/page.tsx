"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import RevixNavbar from "@/components/revix-navbar";
import RevixFooter from "@/components/revix-footer";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success("Account created successfully!");
      router.push("/profile");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create account");
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
            Join the Community
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-black/60 text-sm">Join our private network of Himalayan art collectors.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. John Doe"
              className="w-full px-4 py-3.5 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

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
            <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
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

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-black/70 mb-2">
              Confirm Password
            </label>
            <input
              {...register("confirm")}
              type="password"
              placeholder="Re-type password"
              className="w-full px-4 py-3.5 border border-black/15 rounded-lg text-sm bg-transparent focus:outline-none focus:border-black"
            />
            {errors.confirm && (
              <p className="text-red-500 text-xs mt-1">{errors.confirm.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rx-btn rx-btn-black w-full py-4 text-sm"
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>

          <div className="text-center pt-4">
            <span className="text-xs text-black/60">Already have an account? </span>
            <Link href="/login" className="text-xs font-bold text-black underline">
              Sign In
            </Link>
          </div>
        </form>
      </section>

      <RevixFooter />
    </div>
  );
}
