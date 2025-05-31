import React, { useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Status } from "@/modules/products/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { productSchema } from "./schemas";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Button } from "../ui/button";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject("Invalid file result");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

type ProductFormData = z.infer<typeof productSchema>;

const CreateProductForm = () => {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category_id: "",
      sub_category_id: "",
      description: "",
      price: "",
      user_id: "",
      status: Status.PENDING,
      images: [],
    },
  });

  const mutation = useMutation({
    mutationFn: (newProduct) => {
      return axios.post("/products/", newProduct);
    },
    onError: () => {
      // An error happened!
      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      window.location.href = "/";
    },
  });

  // Mock data for dropdowns
  const categories = [
    { category_id: 1, name: "Electronics" },
    { category_id: 2, name: "Clothing" },
    { category_id: 3, name: "Books" },
    { category_id: 4, name: "Home & Garden" },
  ];

  const subCategories = [
    { sub_category_id: 1, name: "Smartphones", category_id: 1 },
    { sub_category_id: 2, name: "Laptops", category_id: 1 },
    { sub_category_id: 3, name: "T-Shirts", category_id: 2 },
    { sub_category_id: 4, name: "Jeans", category_id: 2 },
    { sub_category_id: 5, name: "Fiction", category_id: 3 },
    { sub_category_id: 6, name: "Tools", category_id: 4 },
  ];

  const filteredSubcategories = useMemo(() => {
    return subCategories.filter(
      (subCategory) =>
        subCategory.category_id === parseInt(form.getValues("category_id"))
    );
  }, [form.watch("category_id")]);

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  const onSubmit = async (data: ProductFormData) => {
    toast.message("hello ");
    try {
      const files = data.images ?? [];

      // Convert files to base64
      const base64Images = await Promise.all(
        files.map((file) => fileToBase64(file))
      );

      const payload = {
        ...data,
        price: parseFloat(data.price),
        category_id: parseInt(data.category_id),
        sub_category_id: parseInt(data.sub_category_id),
        user_id: parseInt(data.user_id),
        images: base64Images, // base64 strings now
      };

      console.log("Submitting payload:", payload);

      // mutation.mutate(payload);
      form.reset();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit product");
    }
  };
  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={category.category_id.toString()}
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

        {/* Sub Category */}
        <FormField
          control={form.control}
          name="sub_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub Category </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a sub category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredSubcategories.map((subCategory) => (
                    <SelectItem
                      key={subCategory.sub_category_id}
                      value={subCategory.sub_category_id.toString()}
                    >
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price </FormLabel>
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

        {/* User */}
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name} ({user.email})
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
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Upload Images (up to 6)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files ?? []);
                    const currentFiles = form.getValues("images") ?? [];

                    const combinedFiles = [...currentFiles, ...newFiles].slice(
                      0,
                      6
                    );

                    if (combinedFiles.length > 6) {
                      toast.error("You can upload a maximum of 6 images.");
                    }

                    form.setValue("images", combinedFiles, {
                      shouldValidate: true,
                    });

                    // Clear input value so same file can be reselected if needed
                    e.target.value = "";
                  }}
                />
              </FormControl>
              <FormMessage />

              <div className="grid grid-cols-3 gap-4 mt-4">
                {(form.watch("images") as File[] | undefined)?.map(
                  (file, index) => (
                    <div
                      className="relative border rounded-md overflow-hidden group"
                      key={index}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`image-${index}`}
                        className="w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(form.getValues("images") ?? [])];
                          updated.splice(index, 1);
                          form.setValue("images", updated, {
                            shouldValidate: true,
                          });
                        }}
                        className="absolute top-1 right-1 bg-white/80 text-black text-xs px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
                      >
                        ✕
                      </button>
                    </div>
                  )
                )}
              </div>
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="images"
          render={() => {
            const inputRef = useRef<HTMLInputElement>(null);
            const [isDragging, setIsDragging] = useState(false);

            const handleFiles = (newFiles: FileList | null) => {
              if (!newFiles) return;

              const filesArray = Array.from(newFiles);
              const currentFiles = form.getValues("images") ?? [];

              const combinedFiles = [...currentFiles, ...filesArray].slice(
                0,
                6
              );

              if (combinedFiles.length > 6) {
                toast.error("You can upload a maximum of 6 images.");
              }

              form.setValue("images", combinedFiles, {
                shouldValidate: true,
              });
            };

            return (
              <FormItem>
                <FormLabel>Upload Images (up to 6)</FormLabel>
                <FormControl>
                  <div>
                    {/* Hidden file input */}
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const newFiles = Array.from(e.target.files ?? []);
                        const currentFiles = form.getValues("images") ?? [];

                        const total = currentFiles.length + newFiles.length;

                        if (total > 6) {
                          toast.error("You can upload a maximum of 6 images.");
                          // Only add as many as fit
                          const remainingSlots = 6 - currentFiles.length;
                          const limitedFiles = newFiles.slice(
                            0,
                            remainingSlots
                          );
                          form.setValue(
                            "images",
                            [...currentFiles, ...limitedFiles],
                            {
                              shouldValidate: true,
                            }
                          );
                        } else {
                          form.setValue(
                            "images",
                            [...currentFiles, ...newFiles],
                            {
                              shouldValidate: true,
                            }
                          );
                        }

                        e.target.value = "";
                      }}
                    />

                    {/* Dropzone Box */}
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer text-center transition",
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      )}
                      onClick={() => inputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);

                        const droppedFiles = Array.from(e.dataTransfer.files);
                        const currentFiles = form.getValues("images") ?? [];

                        const total = currentFiles.length + droppedFiles.length;

                        if (total > 6) {
                          toast.error("You can upload a maximum of 6 images.");
                          const remainingSlots = 6 - currentFiles.length;
                          const limitedFiles = droppedFiles.slice(
                            0,
                            remainingSlots
                          );
                          form.setValue(
                            "images",
                            [...currentFiles, ...limitedFiles],
                            {
                              shouldValidate: true,
                            }
                          );
                        } else {
                          form.setValue(
                            "images",
                            [...currentFiles, ...droppedFiles],
                            {
                              shouldValidate: true,
                            }
                          );
                        }
                      }}
                    >
                      <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
                      <p className="text-sm text-gray-600">
                        Drag and drop files here or{" "}
                        <span className="text-blue-600 underline">
                          choose files
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Max 6 images</p>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />

                {/* Image Preview */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {(form.watch("images") as File[] | undefined)?.map(
                    (file, index) => (
                      <div
                        className="relative border rounded-md overflow-hidden group"
                        key={index}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`image-${index}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...(form.getValues("images") ?? []),
                            ];
                            updated.splice(index, 1);
                            form.setValue("images", updated, {
                              shouldValidate: true,
                            });
                          }}
                          className="absolute top-1 right-1 bg-white/80 text-black text-xs px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  )}
                </div>
              </FormItem>
            );
          }}
        />

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex-1"
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting
              ? "Creating Product..."
              : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="flex-1"
          >
            Reset Form
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateProductForm;
