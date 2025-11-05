"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOutUser } from "../dal/auth-actions";

export default function SignOutButton() {
	const router = useRouter();

	async function handleClick() {
		await signOutUser();
		router.refresh();
	}

	return (
		<Button variant={"destructive"} onClick={handleClick}>
			Logout
		</Button>
	);
}
