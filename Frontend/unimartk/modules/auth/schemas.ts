import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .refine((email) => email.endsWith("hs-fulda.de"), {
        message:
          "Only Hochschule Fulda emails (ending with hs-fulda.de) are allowed",
      }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    faculty: z.boolean().optional(),
    admin: z.boolean().optional(),
    securityQuestion: z.string().min(1, "Security question must be selected"),
    answer: z.string().min(1, "Answer is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // 👈 show error under confirmPassword field
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
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
