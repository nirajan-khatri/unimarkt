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
import {
  fetchproductCategories,
  fetchProductSubcategories,
} from "@/modules/home/api";
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

  console.log(user);

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
      department_id: "",
      job_type: undefined,
      remuneration: "",
      contact_email: "",
      contact_name: "",
      contact_phone: "",
    },
  });

  const jobTypes = [
    { value: "research", label: "Research" },
    { value: "hiwi", label: "Hiwi" },
    { value: "tutoring", label: "Tutoring" },
    { value: "administrative", label: "Administrative" },
    { value: "other", label: "Other" },
  ];

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
        return axios.put(`/job-postings/${jobId}/`, newJob);
      }
      return axios.post("/job-postings/", newJob);
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
      window.location.href = "/";
    },
  });

  // Loading state for edit mode
  if (jobId && isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  const onSubmit = async (data: JobFromData) => {
    try {
      const payload = {
        ...data,
        status: "pending",
        posted_by_id: user!.id,
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
                name="job_type"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Job Type</FormLabel>
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
                        {jobTypes.map((job) => (
                          <SelectItem key={job.value} value={job.value}>
                            {job.label}
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
              />
            </div>
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
              name="remuneration"
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
                        type="text"
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
            <FormField
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
            />
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
