import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstname: z.string().min(2, "First name required"),
    lastname: z.string().min(2, "Last name required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
    role: z.enum(["user", "admin", "deliveryMan"]),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterCredentials = z.infer<typeof registerSchema>;
