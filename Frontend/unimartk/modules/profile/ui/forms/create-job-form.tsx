"use client";

import React, { useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { jobSchema } from "../../schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Button } from "../../../../components/ui/button";

import { Category } from "@/modules/home/types";
import LoadingPage from "@/app/(admin)/admin/loader";
import ErrorPage from "@/app/(admin)/admin/error";
import { fetchJobCategories } from "@/modules/home/api";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { redirect, useRouter } from "next/navigation";
import { fetchJobById } from "@/services/products";
import { departments } from "@/constants/departments";

interface Props {
  jobId?: string;
}

type JobFromData = z.infer<typeof jobSchema>;

const CreateJobForm = ({ jobId }: Props) => {
  const router = useRouter();
  const { isAuthenticated, user, isInitialized } = useAuth();

  if ((!isAuthenticated || !user) && isInitialized) {
    redirect("/sign-in");
  }

  const queryClient = useQueryClient();

  const {
    data: job,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJobById(jobId!),
    enabled: !!jobId,
  });

  const form = useForm<JobFromData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
      qualifications: "",
      salary_per_hour: "",
      location: "",
      category_id: "",
      contact_email: "",
    },
  });

  console.log(form.formState.errors);

  const {
    data: categoryData,
    isLoading: categoryIsLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["jobCategories"],
    queryFn: fetchJobCategories,
  });

  // Update form and preview images when product data is loaded
  // useEffect(() => {
  //   if (product) {
  //     form.reset({
  //       name: product?.name || "",
  //       description: product?.description || "",
  //       images: product?.images || [],
  //       price: product?.price.toString() || "",
  //       pickup_location: product?.pickup_location || "",
  //       category_id: product?.category?.id?.toString() || "",
  //       sub_category_id: product?.sub_category?.id?.toString() || "",
  //     });
  //   }
  // }, [product, form]);

  const mutation = useMutation({
    mutationFn: (newJob: JobFromData) => {
      if (jobId) {
        return axios.put(`/jobs/${jobId}/`, newJob);
      }
      return axios.post("/jobs/", newJob);
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["job", "profileJobs"],
      });

      toast.success(
        jobId ? "Jobs updated successfully!" : "Jobs created successfully!"
      );
      window.location.href = "/profile";
    },
  });

  if ((jobId && isLoading) || categoryIsLoading) {
    return <LoadingPage />;
  }

  if (error || categoryError) {
    return <ErrorPage />;
  }

  const onSubmit = async (data: JobFromData) => {
    try {
      const payload = {
        ...data,
        status: "pending",
        user_id: user!.id,
      };

      console.log("Submitting payload:", payload);
      mutation.mutate(payload);

      if (!jobId) {
        form.reset();
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit product");
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            {/* Job Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Job Title<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter job title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Qualifications
                    <span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Masters.." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category */}
            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Category<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryData &&
                          categoryData.slice(1).map((category: Category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      Department<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem
                            key={department.id}
                            value={department.id.toString()}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Location (City)
                    <span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter job description"
                      rows={6}
                      {...field}
                      className="flex-1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price */}
            <FormField
              control={form.control}
              name="salary_per_hour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Remuneration<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        €
                      </span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        className="pl-7"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contact Email<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contact Name<span className="text-red-500 -ml-1.5">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1"
              >
                {form.formState.isSubmitting
                  ? jobId
                    ? "Updating Job..."
                    : "Creating Job..."
                  : jobId
                    ? "Update Job"
                    : "Create Job"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                }}
                className="flex-1"
              >
                Reset Form
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateJobForm;
