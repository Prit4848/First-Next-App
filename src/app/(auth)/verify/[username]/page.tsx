"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/Schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiREsponse";
import { Form } from "@/components/ui/form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();
  const params = useParams();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmiting(true);
    try {
      const payload = {
        code: data.code,
        username: String(params.username),
      };
      console.log(payload);

      const response = await axios.post(`/api/verify-code`, payload);
      toast.success(response.data.message);
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data?.message;
      toast.error(errorMessage || "Something Went Wrong");
    } finally {
      setIsSubmiting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-x-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">
            Enter the 6-digit verification code sent to your email to continue
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* verification code */}
            <FieldGroup>
              <Controller
                name="code"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="form-rhf-input-code">
                      verify code
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-input-code"
                      placeholder="Enter Your verification code"
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
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Page;
