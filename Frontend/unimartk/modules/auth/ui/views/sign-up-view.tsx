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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { registerSchema } from "../../schemas";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SignUpView = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      admin: false,
      faculty: false,
      answer: "",
      securityQuestion: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    console.log(values);
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
                  Sign in
                </Link>
              </Button>
            </div>
            <h1 className="text-4xl font-medium">Join the Community.</h1>
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
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
            <div className="">
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="faculty"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="mb-0">Faculty</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admin"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="mb-0">Admin</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Disclaimer: Needs Approval
              </p>
            </div>
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
                    <SelectContent>
                      <SelectItem value="pet">
                        What is your pet’s name?
                      </SelectItem>
                      <SelectItem value="school">
                        What was the name of your first school?
                      </SelectItem>
                      <SelectItem value="city">
                        In which city were you born?
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
                  <FormDescription>
                    Will be used in case of possword forgotten{" "}
                  </FormDescription>
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
              Create account
            </Button>
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
