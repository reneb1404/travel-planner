import { Button } from "@/components/ui/button";
import SignOutButton from "@/features/auth/components/logout-button";
import { getCurrentUser } from "@/features/auth/dal/queries";
import Link from "next/link";

export default async function Home() {
	const user = await getCurrentUser();

	return (
		<div className="my-6 px-4 max-w-md mx-auto">
			<div className="text-center space-y-6">
				{user == null ? (
					<>
						<h1 className="text-3xl font-bold">Welcome to Our App</h1>
						<Button asChild size="lg">
							<Link href="/auth/login">Sign In / Sign Up</Link>
						</Button>
					</>
				) : (
					<>
						<h1 className="text-3xl font-bold">Welcome {user.name}!</h1>
						<div className="flex gap-4 justify-center">
							<SignOutButton />
						</div>
					</>
				)}
			</div>
		</div>
	);
}
