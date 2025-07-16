"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { registerSchema } from "../../schemas";
import { fetchSecurityQuestions, registerUser } from "../../services/api";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { PasswordStrengthIndicator } from "../components/password-strength-indicator";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const SignInLink = dynamic(
  () =>
    Promise.resolve(({ children }: { children: React.ReactNode }) => {
      const getSignUpUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get("redirect");
        return redirect ? `/sign-in?redirect=${redirect}` : "/sign-in";
      };

      return <Link href={getSignUpUrl()}>{children}</Link>;
    }),
  { ssr: false }
);

type RegisterFormData = z.infer<typeof registerSchema>;

export const SignUpView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [redirectUrl, setRedirectUrl] = useState<string>("/");
  const router = useRouter();

  const {
    data: securityQuestions,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useQuery({
    queryKey: ["security-questions"],
    queryFn: fetchSecurityQuestions,
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success("Registration successful! Welcome to UniMarkt!");

      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");

      // Use encodeURIComponent to make sure the redirect URL is preserved properly
      const signInUrl = redirect
        ? `/sign-in?redirect=${encodeURIComponent(redirect)}`
        : "/sign-in";

      router.push(signInUrl);
    },
    onError: (error) => {
      toast.error(`${Object.values(error)[0][0] as string}`);
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    }
  }, []);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contact_number: "",
      is_admin: false,
      is_staff: false,
      securityQuestion: "",
      answer: "",
    },
  });

  const onSubmit = (values: RegisterFormData) => {
    const registerData = {
      name: values.name,
      email: values.email,
      password: values.password,
      contact_number: values.contact_number || undefined,
      is_admin: values.is_admin,
      is_staff: values.is_staff,
      security_question1: values.securityQuestion,
      answer1: values.answer,
    };
    registerMutation.mutate(registerData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-background text-foreground h-screen w-full lg:col-span-3 overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 p-4 lg:p-16"
          >
            <div className="flex items-center justify-between mb-8">
              <Link href="/">
                <span className="text-2xl font-black">UniMarkt</span>
              </Link>
              <SignInLink>
                <Button className="text-base underline" variant="ghost">
                  Sign In
                </Button>
              </SignInLink>
            </div>

            <h1 className="text-4xl font-medium">Join the Community.</h1>

            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Name<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Email<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Contact Number
                    {/* <span className="text-red-500 -ml-1.5">*</span> */}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Optional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Password<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <PasswordStrengthIndicator
                    password={field.value}
                    className="mt-2"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Confirm Password
                    <span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setShowConfirmPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-2">
              <div className="flex gap-5">
                <FormField
                  control={form.control}
                  name="is_admin"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!m-0">Admin</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_staff"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!m-0">Staff</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Requires approval.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-medium">Security Question</h2>
              <p className="text-sm text-muted-foreground">
                Please select and answer a security question for account
                recovery.
              </p>

              <FormField
                control={form.control}
                name="securityQuestion"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-base">
                      Security Question
                      <span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingQuestions}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="">
                          <SelectValue
                            placeholder={
                              isLoadingQuestions
                                ? "Loading questions..."
                                : questionsError
                                  ? "Error loading questions"
                                  : "Choose a security question"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {securityQuestions?.map((question) => (
                          <SelectItem key={question.key} value={question.key}>
                            {question.question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Answer<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your answer..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {questionsError && (
              <p className="text-sm text-destructive">
                Failed to load security questions. Please refresh the page.
              </p>
            )}

            <Button
              disabled={registerMutation.isPending}
              type="submit"
              size="lg"
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/85"
            >
              {registerMutation.isPending
                ? "Creating account..."
                : "Create account"}
            </Button>

            {/* Registration Error */}
            {registerMutation.isError && (
              <p className="text-sm text-destructive text-center">
                Registration failed. Please try again.
              </p>
            )}
          </form>
        </Form>
      </div>

      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block bg-cover bg-center"
        style={{
          backgroundImage: "url('/auth-bg.png')",
        }}
      ></div>
    </div>
  );
};
