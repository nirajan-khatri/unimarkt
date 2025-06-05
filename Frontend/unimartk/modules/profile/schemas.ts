import { z } from "zod";

export const DayEnum = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Product name must not exceed 100 characters"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid decimal number (e.g., 10.50)"
    )
    .refine((val) => parseFloat(val) > 0, "Price must be greater than 0"),
  category_id: z.string().min(1, "Please select a category"),
  sub_category_id: z.string().min(1, "Please select a sub category"),
  location: z.string().min(1, "Location is required"),
  images: z
    .array(z.string())
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
  module: z.string().min(1, "Module is required"),
  charge_per_hour: z
    .string()
    .min(1, "Price is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid decimal number (e.g., 10.50)"
    )
    .refine((val) => parseFloat(val) > 0, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  skill_category_id: z.string().min(1, "Please select a category"),
  department_id: z.string().min(1, "Department is required"),
  degree_id: z.string().min(1, "Degree is required"),
  skill_cover: z.string().min(1, "Image is required"),
  available_time_week: z
    .array(
      z.object({
        day: DayEnum,
        start_time: z.string().min(1, "Start time is required"),
        end_time: z.string().min(1, "End time is required"),
        status: z.enum(["open", "booked"]),
      })
    )
    .min(1, "At least one availability slot is required"),
});
