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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { registerSchema } from "../../schemas";
import {
  fetchSecurityQuestions,
  fetchRoles,
  registerUser,
} from "../../services/api";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

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
  const [redirectUrl, setRedirectUrl] = useState<string>("/");
  const router = useRouter();

  // TanStack Query to fetch security questions
  const {
    data: securityQuestions,
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useQuery({
    queryKey: ["security-questions"],
    queryFn: fetchSecurityQuestions,
  });

  // TanStack Query to fetch roles
  const {
    data: roles,
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  // Mutation for user registration
  // const registerMutation = useMutation({
  //   mutationFn: registerUser,
  //   onSuccess: (data) => {
  //     console.log("Registration successful:", data);
  //     // Show success alert
  //     alert("Registration successful! Welcome to UniMarkt!");

  //     // Construct sign-in URL with redirect parameter if it exists
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const redirect = urlParams.get("redirect");
  //     const signInUrl = redirect ? `/sign-in?redirect=${redirect}` : "/sign-in";

  //     // Redirect to sign-in page
  //     router.push(signInUrl);
  //   },
  //   onError: (error: Error) => {
  //     console.error("Registration failed:", error.message);
  //     // Show error alert
  //     alert(`Registration failed: ${error.message}`);
  //   },
  // });

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
    onError: (error: Error) => {
      toast.error(`Registration failed: ${error.message}`);
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
      security_question2: values.securityQuestion,
      answer2: values.answer,
      security_question3: values.securityQuestion,
      answer3: values.answer,
    };

    console.log(registerData);

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

            {/* Name */}
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Number */}
            <FormField
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Optional" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Password *</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Confirm Password *
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
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

            {/* Security Question */}
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
                  <FormItem>
                    <FormLabel className="text-base">
                      Security Question *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingQuestions}
                    >
                      <FormControl>
                        <SelectTrigger>
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

              {/* Security Answer */}
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Answer *</FormLabel>
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

            {/* Submit Button */}
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

      {/* Right side image section */}
      <div
        className="h-screen w-full lg:col-span-2 hidden lg:block bg-cover bg-center"
        style={{
          backgroundImage: "url('/auth-bg.png')",
        }}
      ></div>
    </div>
  );
};
