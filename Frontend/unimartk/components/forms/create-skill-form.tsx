import React, { useMemo } from "react";
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
import { skillSchema } from "./schemas";
import { useMutation } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Button } from "../ui/button";
import {
  Book,
  Code,
  DollarSign,
  Dumbbell,
  Languages,
  Lightbulb,
  Music,
  Palette,
} from "lucide-react";

type SkillFormData = z.infer<typeof skillSchema>;

const CreateSkillForm = () => {
  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      department: "",
      module: "",
      description: "",
      price: "",
      user_id: "",
      status: Status.PENDING,
      skill_cover: "",
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

  const skillCovers = [
    { value: "academic", label: "Academic", icon: Book },
    { value: "programming", label: "Programming", icon: Code },
    { value: "language", label: "Language", icon: Languages },
    { value: "creative", label: "Creative", icon: Palette },
    { value: "finance", label: "Finance", icon: DollarSign },
    { value: "music", label: "Music", icon: Music },
    { value: "fitness", label: "Fitness", icon: Dumbbell },
    { value: "softskills", label: "Soft Skills", icon: Lightbulb },
  ];
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  const onSubmit = async (data: SkillFormData) => {
    try {
      const payload = {
        ...data,
        price: parseFloat(data.price),
        user_id: parseInt(data.user_id),
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
        {/* <FormField
          control={form.control}
          name="dep"
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
        /> */}

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Enter department" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="module"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module</FormLabel>
              <FormControl>
                <Input placeholder="Enter module" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sub Category */}
        {/* <FormField
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
        /> */}

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
              <FormLabel>Price (€/hr)</FormLabel>
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
        <FormField
          control={form.control}
          name="skill_cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Skill Cover</FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {skillCovers.map((cover) => (
                    <label
                      key={cover.value}
                      className={`border rounded-lg p-4 text-center cursor-pointer transition ${
                        field.value === cover.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={cover.value}
                        checked={field.value === cover.value}
                        onChange={() => field.onChange(cover.value)}
                        className="hidden"
                      />
                      <cover.icon className="mx-auto mb-2 h-8 w-8" />
                      <span className="text-sm">{cover.label}</span>
                    </label>
                  ))}
                </div>
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
            onClick={form.handleSubmit(onSubmit)}
          >
            {form.formState.isSubmitting ? "Creating Skill..." : "Create Skill"}
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

export default CreateSkillForm;
