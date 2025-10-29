import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<div className="my-6 px-4 max-w-md mx-auto">
			<div className="text-center space-y-6">
				<h1 className="text-3xl font-bold">Welcome to my App!</h1>
				<Button>
					<Link href="/auth/login"> Sign In / Sign Up</Link>
				</Button>
			</div>
		</div>
	);
}
