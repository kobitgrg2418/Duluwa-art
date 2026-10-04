"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FlowButton } from "@/components/ui/flow-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

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
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { confirm: "" },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      router.push("/");
      router.refresh();
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold mb-6">
            Duluwa Art
          </Link>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">Join our community of art lovers and collectors</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
              </div>

              <div>
                <Label htmlFor="confirm">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirm")}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                </div>
                {errors.confirm && <p className="mt-1 text-sm text-destructive">{errors.confirm.message}</p>}
              </div>

              <FlowButton text="Create account" type="submit" loading={loading} className="w-full" />
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <FlowButton 
              text="Continue with Google"
              variant="outline"
              onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`}
              loading={loading}
              className="w-full"
            />
          </CardContent>
          <CardFooter className="flex justify-center p-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link>
          {" and "}
          <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}