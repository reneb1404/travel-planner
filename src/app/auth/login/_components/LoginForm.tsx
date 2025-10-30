"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const signInSchema = z.object({
	email: z.email("Invalid email address").min(1, "Email is required"),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.max(64, "Password must be at most 64 characters long"),
});

type SignInForm = z.infer<typeof signInSchema>;

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const router = useRouter();
	const form = useForm<SignInForm>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: SignInForm) {
		setIsSubmitting(true);
		await authClient.signIn.email(
			{ ...data, callbackURL: "/" },
			{
				onError: (error) => {
					setIsSubmitting(false);
					toast.error(
						error.error.message || "An error occurred. Please try again later."
					);
				},
				onSuccess: () => {
					setIsSubmitting(false);
					router.push("/");
				},
			}
		);
	}

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0">
				<CardContent className="grid p-0 md:grid-cols-2">
					<form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							<div className="flex flex-col items-center gap-2 text-center">
								<h1 className="text-2xl font-bold">Welcome back</h1>
								<p className="text-muted-foreground text-balance">
									Login to your {/*App Name */} account
								</p>
							</div>
							<Controller
								control={form.control}
								name="email"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Email</FieldLabel>
										<Input
											type="email"
											placeholder="m@example.com"
											{...field}
										></Input>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								control={form.control}
								name="password"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<div className="flex items-center">
											<FieldLabel>Password</FieldLabel>
											<Link
												href="#"
												className="ml-auto text-sm underline-offset-4 hover:underline"
											>
												Forgot your password?
											</Link>
										</div>
										<PasswordInput {...field}></PasswordInput>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Button type="submit" className="w-full">
								<LoadingSwap isLoading={isSubmitting}>Login</LoadingSwap>
							</Button>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or
							</FieldSeparator>
							<Field className="grid grid-cols-3 gap-4">
								<Button variant="outline" type="button" className="col-span-3">
									Login with Google
								</Button>
							</Field>
							<FieldDescription className="text-center">
								Don&apos;t have an account? <a href="signup">Sign up</a>
							</FieldDescription>
						</FieldGroup>
					</form>
					<div className="bg-muted relative hidden md:block">
						<img
							src="/placeholder.svg"
							alt="Image"
							className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
						/>
					</div>
				</CardContent>
			</Card>
			<FieldDescription className="px-6 text-center text-balance">
				By clicking continue, you agree to our{" "}
				<Link href="#">Terms of Service</Link> and{" "}
				<Link href="#">Privacy Policy</Link>.
			</FieldDescription>
		</div>
	);
}
