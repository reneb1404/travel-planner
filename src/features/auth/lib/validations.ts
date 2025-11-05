// src/features/auth/lib/validations.ts
import * as z from "zod";

export const loginSchema = z.object({
	email: z.email("Invalid email address").min(1, "Email is required"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(64, "Password must be at most 64 characters long"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters long"),
	email: z.email("Invalid email address").min(1, "Email is required"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(64, "Password must be at most 64 characters long"),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
