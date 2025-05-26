"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { Status } from "@/modules/products/types";
import { toast } from "sonner";

// Zod Schema
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Product name must not exceed 100 characters"),
  category_id: z.string().min(1, "Please select a category"),
  sub_category_id: z.string().min(1, "Please select a sub category"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid decimal number (e.g., 10.50)"
    )
    .refine((val) => parseFloat(val) > 0, "Price must be greater than 0"),
  user_id: z.string().min(1, "Please select a user"),
  status: z.nativeEnum(Status),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = () => {
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
    },
  });

  const mutation = useMutation({
    mutationFn: (newProduct: { [k: string]: FormDataEntryValue }) => {
      return axios.post("/products/", newProduct);
    },
    onError: () => {
      // An error happened!
      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
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
    try {
      const formData = new FormData();

      // Convert and append form fields
      formData.append("category_id", String(parseInt(data.category_id)));
      formData.append(
        "sub_category_id",
        String(parseInt(data.sub_category_id))
      );
      formData.append("user_id", String(parseInt(data.user_id)));
      formData.append("price", String(parseFloat(data.price)));

      // Append other text fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("status", data.status);

      console.log("Form submitted:", Object.fromEntries(formData.entries()));
      mutation.mutate(Object.fromEntries(formData.entries()));

      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <FormLabel>Sub Category *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <FormLabel>Description *</FormLabel>
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
                    <FormLabel>Price *</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="0.00" {...field} />
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
                    <FormLabel>User *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
