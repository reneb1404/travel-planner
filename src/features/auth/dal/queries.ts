"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return session?.user ?? null;
});

export const requireAuth = cache(async () => {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/login");
	}

	return user;
});

export const getUserId = cache(async () => {
	const user = await getCurrentUser();
	return user?.id ?? null;
});

export const requireUserId = cache(async () => {
	const user = await requireAuth();

	return user.id;
});
