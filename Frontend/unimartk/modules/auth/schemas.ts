import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    email: z
      .string()
      .email("Invalid email address")
      .refine((email) => email.endsWith("hs-fulda.de"), {
        message:
          "Only Hochschule Fulda emails (ending with hs-fulda.de) are allowed",
      }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contact_number: z.string().max(20).optional(),
    is_admin: z.boolean().optional(),
    is_staff: z.boolean().optional(),
    securityQuestion: z.string().min(1, "Please select a security question"),
    answer: z.string().min(1, "Answer is required").max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  securityQuestion: z.string().min(1, "Security question must be selected"),
  answer: z.string().min(1, "Answer is required"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 show error under confirmPassword field
  });
