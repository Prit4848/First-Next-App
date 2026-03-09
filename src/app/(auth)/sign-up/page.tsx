"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { signUpSchema } from "@/Schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiREsponse";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error Checking Username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/sign-up`, data);
      toast.success(response.data?.message);
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="p-8 bg-slate-900/50 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
              Join <span className="text-purple-400">True Feedback</span>
            </h1>
            <p className="mt-2 text-slate-400">Create your account to start your journey</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Username Field */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Username</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="johndoe"
                          className="bg-slate-950 border-slate-800 text-white focus:ring-purple-500/50 pr-10"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            debouncedUsername(e.target.value);
                          }}
                        />
                      </FormControl>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isCheckingUsername && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                      </div>
                    </div>
                    {usernameMessage && (
                      <div className={`flex items-center gap-1.5 text-xs mt-1 font-medium ${
                        usernameMessage === "Username is Unique" ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {usernameMessage === "Username is Unique" ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {usernameMessage}
                      </div>
                    )}
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="john@example.com"
                        className="bg-slate-950 border-slate-800 text-white focus:ring-purple-500/50"
                      />
                    </FormControl>
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
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="bg-slate-950 border-slate-800 text-white focus:ring-purple-500/50"
                      />
                    </FormControl>
                    <FormMessage className="text-rose-400 text-xs" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-slate-200 font-bold py-6 transition-all shadow-lg shadow-white/5"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizing...</>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-8 pt-6 border-t border-slate-800/50">
            <p className="text-slate-400 text-sm">
              Already a member?{" "}
              <Link href="/sign-in" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;