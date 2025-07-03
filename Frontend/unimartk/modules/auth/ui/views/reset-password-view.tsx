"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { resetPasswordSchema } from "../../schemas";
import { useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../services/api";

export const ResetPasswordView = () => {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"error" | "success">("error");
  const { getUserId } = useAuth();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setMessageType("success");
      setMessage("Password reset successful. ");
    },
    onError: (error: any) => {
      setMessageType("error");
      setMessage(error.message || "Password reset failed. Please try again.");
    },
  });

  const onSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    resetPasswordMutation.mutate({
      id: getUserId(),
      new_password: values.password,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href={"/"}>
                <span className={"text-2xl font-black"}>UniMarkt</span>
              </Link>
              <Button
                asChild
                className="text-base border-none underline"
                variant={"ghost"}
              >
                <Link prefetch href={"/sign-in"}>
                  Sign In
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">Set new password</h1>
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={false}
              type="submit"
              size={"lg"}
              variant={"default"}
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              Change Password
            </Button>

            {message && (
              <div
                className={`rounded-md border ${messageType === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700"}  px-4 py-3 mt-2 text-sm`}
              >
                {message}

                {messageType === "success" && <Link prefetch href={"/sign-in"}>
                  Sign In here.
                </Link>}
              </div>
            )}
          </form>
        </Form>
      </div>
      <div
        style={{
          backgroundImage: "url('/auth-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="h-screen w-full lg:col-span-2 hidden lg:block"
      ></div>
    </div>
  );
};
