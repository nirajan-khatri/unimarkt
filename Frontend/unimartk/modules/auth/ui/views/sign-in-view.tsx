"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { get, useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";

import { loginSchema } from "../../schemas";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SignUpLink = dynamic(
  () =>
    Promise.resolve(({ children }: { children: React.ReactNode }) => {
      const getSignUpUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get("redirect");
        return redirect ? `/sign-up?redirect=${redirect}` : "/sign-up";
      };

      return <Link href={getSignUpUrl()}>{children}</Link>;
    }),
  { ssr: false }
);

export const SignInView = () => {
  const [redirectUrl, setRedirectUrl] = useState<string>("/");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    }
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    window.location.href = redirectUrl ? redirectUrl : "/";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 lg:p-16">
          <div className="flex items-center justify-between mb-8">
            <Link href={"/"}>
              <span className={"text-2xl font-black"}>UniMarkt</span>
            </Link>
            <SignUpLink>
              <Button
                className="text-base border-none underline"
                variant={"ghost"}
              >
                Sign Up
              </Button>
            </SignUpLink>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <h1 className="text-4xl font-medium">Welcome back 👋</h1>
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Link prefetch href={"/forgot-password"}>
                forgot password?
              </Link>
              <Button
                disabled={false}
                type="submit"
                size={"lg"}
                variant={"default"}
                className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              >
                Log In
              </Button>
            </form>
          </Form>
        </div>
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
