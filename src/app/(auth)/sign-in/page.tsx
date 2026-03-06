"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/Schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const Page = () => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmiting(true)
    const result = await signIn("credentials", {
      redirect: false,
      callbackUrl: "/dashboard",
      username: data.username,
      password: data.password,
    });
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Incorrect username or password');
      } else {
        toast.error(result.error);
      }
    }

    if (result?.ok && !result.error) {
      router.replace("/dashboard");
      router.refresh();
    }
    setIsSubmiting(false)
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* username */}
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="form-rhf-input-username">
                      username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-username"
                      placeholder="Enter Your username"
                    />
                  </Field>
                )}
              />
            </FieldGroup>
             {/* password */}
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="form-rhf-input-password">
                      password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-password"
                      placeholder="******"
                      type='password'
                    />
                  </Field>
                )}
              />
            </FieldGroup>
            <Button type="submit" disabled={isSubmiting}>
              {isSubmiting ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" /> wait...
                </>
              ) : (
                "SignIn"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
