"use client";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/Schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole, User as UserIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from "next/link";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Invalid username or password");
      } else {
        toast.error(result.error);
      }
    }

    if (result?.ok && !result.error) {
      toast.success("Welcome back!");
      router.replace("/dashboard");
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="p-8 bg-slate-900/40 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
              Welcome Back
            </h1>
            <p className="mt-3 text-slate-400">
              Sign in to manage your secret conversations
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Username / Email</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your unique username"
                          className="bg-slate-950 border-slate-800 text-white focus:ring-purple-500/50 pl-10"
                        />
                      </FormControl>
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    </div>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="bg-slate-950 border-slate-800 text-white focus:ring-purple-500/50 pl-10"
                        />
                      </FormControl>
                      <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    </div>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-slate-200 font-bold py-6 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-8 pt-6 border-t border-slate-800/50">
            <p className="text-slate-400 text-sm">
              Not a member yet?{" "}
              <Link
                href="/sign-up"
                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;