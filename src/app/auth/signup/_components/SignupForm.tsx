"use client";
/*import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
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


export function SignUpForm({
	className,
	...props
}: React.ComponentProps<"div">) {

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Create your account</CardTitle>
					<CardDescription>
						Enter your email below to create your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FieldGroup>
							
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
*/
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

const signUpSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters long"),
		email: z.email("Invalid email address").min(1, "Email is required"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.max(64, "Password must be at most 64 characters long"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters long")
			.max(64, "Password must be at most 64 characters long"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignupForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const router = useRouter();
	const form = useForm<SignUpForm>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: SignUpForm) {
		setIsSubmitting(true);
		await authClient.signUp.email(
			{ ...data, callbackURL: "/" },
			{
				onError: (error) => {
					setIsSubmitting(false);
					toast.error(
						error.error.message || "An error occurred during sign up."
					);
				},
				onSuccess: () => {
					setIsSubmitting(false);
					toast.success(
						"Sign up successful! Please check your email to verify your account."
					);
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
								<h1 className="text-2xl font-bold">Create your account</h1>
								<p className="text-muted-foreground text-sm text-balance">
									Enter your email below to create your account
								</p>
							</div>
							<Controller
								control={form.control}
								name="name"
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Name</FieldLabel>
										<Input placeholder="John Doe" {...field}></Input>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
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
							<Field>
								<Field className="grid grid-cols-2 gap-4">
									<Controller
										control={form.control}
										name="password"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel>Password</FieldLabel>
												<PasswordInput {...field}></PasswordInput>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
									<Controller
										control={form.control}
										name="confirmPassword"
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel>Confirm Password</FieldLabel>
												<PasswordInput {...field}></PasswordInput>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
								</Field>
								<FieldDescription>
									Must be at least 8 characters long.
								</FieldDescription>
							</Field>
							<Field>
								<Button type="submit">
									<LoadingSwap isLoading={isSubmitting}>
										Create Account
									</LoadingSwap>
								</Button>
							</Field>
							<FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
								Or
							</FieldSeparator>
							<Field className="grid grid-cols-3 gap-4">
								<Button variant="outline" type="button" className="col-span-3">
									Sign up with Google
								</Button>
							</Field>
							<FieldDescription className="text-center">
								Already have an account? <Link href="login">Sign in</Link>
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
