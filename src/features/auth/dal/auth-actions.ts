"use client";

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LoginFormData, SignUpFormData } from "../lib/validations";

export async function signInUser(data: LoginFormData) {
	return new Promise((resolve, reject) => {
		authClient.signIn.email(
			{
				email: data.email,
				password: data.password,
				callbackURL: "/",
			},
			{
				onSuccess: (ctx) => {
					toast.success("Sign in successful!");
					resolve(ctx);
				},
				onError: (error) => {
					toast.error(
						error.error.message || "An error occurred during sign in."
					);
					reject(error);
				},
			}
		);
	});
}

export async function signUpUser(data: SignUpFormData) {
	return new Promise((resolve, reject) => {
		authClient.signUp.email(
			{
				name: data.name,
				email: data.email,
				password: data.password,
				callbackURL: "/dashboard",
			},
			{
				onSuccess: (ctx) => {
					toast.success(
						"Sign up successful! Please check your email to verify your account."
					);

					resolve(ctx);
				},
				onError: (error) => {
					toast.error(
						error.error.message || "An error occurred during sign up."
					);
					reject(error);
				},
			}
		);
	});
}

export async function signOutUser() {
	await authClient.signOut();
}
