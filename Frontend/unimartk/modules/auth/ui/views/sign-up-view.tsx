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

import { RegisterData } from "../../types/auth";
import { registerSchema } from "../../schemas";
import {
  fetchSecurityQuestions,
  fetchRoles,
  registerUser,
} from "../../services/api";

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
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      // Show success alert
      alert("Registration successful! Welcome to UniMarkt!");

      // Construct sign-in URL with redirect parameter if it exists
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get("redirect");
      const signInUrl = redirect ? `/sign-in?redirect=${redirect}` : "/sign-in";

      // Redirect to sign-in page
      router.push(signInUrl);
    },
    onError: (error: Error) => {
      console.error("Registration failed:", error.message);
      // Show error alert
      alert(`Registration failed: ${error.message}`);
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get("redirect");
    if (redirect) {
      setRedirectUrl(decodeURIComponent(redirect));
    }
  }, []);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      contact_number: "",
      role: "",
      securityQuestion: "",
      answer: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    const registerData: RegisterData = {
      name: values.name,
      email: values.email,
      password: values.password,
      contact_number: values.contact_number || undefined,
      role: values.role ? parseInt(values.role) : undefined,
      // Send the same security question and answer to all three fields
      security_question1: values.securityQuestion,
      answer1: values.answer,
      security_question2: values.securityQuestion,
      answer2: values.answer,
      security_question3: values.securityQuestion,
      answer3: values.answer,
    };

    registerMutation.mutate(registerData);
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
              <SignInLink>
                <Button
                  className="text-base border-none underline"
                  variant={"ghost"}
                >
                  Sign In
                </Button>
              </SignInLink>
            </div>
            <h1 className="text-4xl font-medium">Join the Community.</h1>

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

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">Role</FormLabel>
                  {isLoadingRoles ? (
                    <div className="text-sm text-muted-foreground">
                      Loading roles...
                    </div>
                  ) : rolesError ? (
                    <div className="text-sm text-red-500">
                      Error loading roles. Please try again.
                    </div>
                  ) : (
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {roles?.map((role) => (
                          <FormItem
                            key={role.id}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={role.id.toString()} />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {role.name.charAt(0).toUpperCase() +
                                role.name.slice(1)}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                  <FormDescription>Select your role (optional)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <p className="text-sm text-red-500">
                Failed to load security questions. Please refresh the page.
              </p>
            )}

            <Button
              disabled={registerMutation.isPending}
              type="submit"
              size={"lg"}
              variant={"default"}
              className="bg-black text-white hover:bg-pink-400 hover:text-primary"
            >
              {registerMutation.isPending
                ? "Creating account..."
                : "Create account"}
            </Button>

            {registerMutation.isError && (
              <p className="text-sm text-red-500 text-center">
                Registration failed. Please try again.
              </p>
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
