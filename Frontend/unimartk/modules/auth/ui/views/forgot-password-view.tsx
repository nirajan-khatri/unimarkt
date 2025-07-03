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
import { forgotPasswordSchema } from "../../schemas";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  verifyUserEmail,
  verifyUserSecurityQuestion,
} from "../../services/api";
import { UserProfile } from "../../types/auth";
import { useAuth } from "../../contexts/authContext";

const ForgotPasswordView = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { setUserId } = useAuth();

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "all",
    defaultValues: {
      securityQuestion: "",
      answer: "",
      email: "",
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: verifyUserEmail,
    onSuccess: async (data: UserProfile) => {
      try {
        const formValues = form.getValues();

        await verifyUserSecurityQuestion({
          id: Number(data.id),
          key: formValues.securityQuestion,
          answer: formValues.answer,
        });
        setUserId(data.id);
        router.push("/reset-password");
      } catch (error: any) {
        setErrorMsg(error.message || "Verification failed. Please try again.");
      }
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Verification failed. Please try again.");
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    verifyEmailMutation.mutate(values.email);
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
            <h1 className="text-4xl font-medium">Retreive your password</h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="securityQuestion"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="text-base">Security Question</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Security Question" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-[#f0f0ee]">
                      <SelectItem value="mother_maiden">
                        What is your mother's maiden name?
                      </SelectItem>
                      <SelectItem value="first_pet">
                        What was your first pet's name?
                      </SelectItem>
                      <SelectItem value="favorite_book">
                        What is your favorite book?
                      </SelectItem>
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
                  <FormLabel className="text-base">Answer</FormLabel>
                  <FormControl>
                    <Input placeholder="Your answer..." {...field} />
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
              {verifyEmailMutation.isPending ? "Verifying..." : "Continue"}
            </Button>
            {errorMsg && (
              <div
                className="rounded-md bg-red-100 border border-red-400 text-red-700 px-4 py-3 mt-2 text-sm"
                role="alert"
              >
                {errorMsg}
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

export default ForgotPasswordView;
