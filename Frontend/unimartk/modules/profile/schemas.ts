import { Status } from "@/modules/products/types";
import { z } from "zod";

export const productSchema = z.object({
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
  location: z.string().min(1, "Location is required"),
  images: z
    .custom<File[]>()
    .refine((files) => files.length > 0, {
      message: "Please upload at least one image.",
    })
    .refine((files) => files.length <= 6, {
      message: "You can upload up to 6 images.",
    }),
});

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Skill name must not exceed 100 characters"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid decimal number (e.g., 10.50)"
    )
    .refine((val) => parseFloat(val) > 0, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  department: z.string().min(1, "Department is required"),
  module: z.string().min(1, "Module is required"),
  user_id: z.string().min(1, "Please select a user"),
  status: z.nativeEnum(Status),
  skill_cover: z.string().min(1, "Image is required"),
});
