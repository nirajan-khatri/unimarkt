"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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

// Import organized modules
import { loginSchema } from "../../schemas";
import { AuthStorage } from "../../utils/auth";
import { LoginResponse } from "../../types/auth";
import { loginUser } from "../../services/api";

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
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    if (AuthStorage.isAuthenticated()) {
      router.push("/"); // Redirect to home if already logged in
      return;
    }

    // Get redirect URL from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    }
  }, [router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // TanStack Query mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data: LoginResponse) => {
      try {
        // Store auth data
        AuthStorage.storeAuthData(data);
        
        // Redirect to the appropriate page
        router.push(redirectUrl);
        
      } catch (error) {
        console.error("Error storing user data:", error);
        alert("Login successful but failed to store user data locally.");
      }
    },
    onError: (error: Error) => {
      alert(`Login failed: ${error.message}`);
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
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
                disabled={loginMutation.isPending}
                type="submit"
                size={"lg"}
                variant={"default"}
                className="bg-black text-white hover:bg-pink-400 hover:text-primary"
              >
                {loginMutation.isPending ? "Logging in..." : "Log In"}
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