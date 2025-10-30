"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
	const { data: session, isPending: loading } = authClient.useSession();

	if (loading) {
		return <div className="my-6 px-4 max-w-md mx-auto">Loading...</div>;
	}

	return (
		<div className="my-6 px-4 max-w-md mx-auto">
			<div className="text-center space-y-6">
				{session == null ? (
					<>
						<h1 className="text-3xl font-bold">Welcome to my App!</h1>
						<Button>
							<Link href="/auth/login"> Sign In / Sign Up</Link>
						</Button>
					</>
				) : (
					<>
						<h1 className="text-3xl font-bold">Welcome {session.user.name}</h1>
						{/* TODO: Add loading states */}
						<Button
							size="lg"
							variant={"destructive"}
							onClick={() => authClient.signOut()}
						>
							Logout
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
