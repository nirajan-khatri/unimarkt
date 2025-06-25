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
import { useAuth } from "../../contexts/authContext"; // Updated import
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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");

    if (isAuthenticated) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/"); // fallback if no redirect provided
      }
      return;
    }

    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    }

    setIsLoading(false);
  }, [isAuthenticated, router]);

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
        login(data);
        router.push(redirectUrl);
      } catch (error) {
        setErrorMsg("Login successful but failed to store user data locally.");
      }
    },
    onError: (error: any) => {
      // Show a user-friendly error message
      if (error?.response?.status === 400 || (typeof error.message === 'string' && error.message.includes('400'))) {
        setErrorMsg("Email and password do not match.");
      } else if (error.message.includes("401") || error.message.toLowerCase().includes("unauthorized")) {
        setErrorMsg("Invalid email or password. Please try again.");
      } else {
        setErrorMsg(error.message || "Login failed. Please try again.");
      }
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setErrorMsg(""); // Clear error on new submit
    loginMutation.mutate({
      email: values.email,
      password: values.password,
    });
  };

  // Early return while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f4f4f0]">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render the form at all if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-background text-foreground h-screen w-full lg:col-span-3 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 lg:p-16">
          <div className="flex items-center justify-between mb-8">
            <Link href={"/"}>
              <span className="text-2xl font-black">UniMarkt</span>
            </Link>
            <SignUpLink>
              <Button
                className="text-base border-none underline"
                variant="ghost"
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
              <Link
                className="text-sm text-muted-foreground hover:underline"
                prefetch
                href={"/forgot-password"}
              >
                Forgot password?
              </Link>
              <Button
                disabled={loginMutation.isPending}
                type="submit"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/85"
              >
                {loginMutation.isPending ? "Logging in..." : "Log In"}
              </Button>
              {errorMsg && (
                <div className="rounded-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 text-sm" role="alert">
                  {errorMsg}
                </div>
              )}
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
        className="h-screen w-full lg:col-span-2 hidden lg:block dark:brightness-[0.6]"
      />
    </div>
  );
};
