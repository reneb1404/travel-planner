"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center mx-auto">
				<div className="mr-4 flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<span className="font-bold">Travel-Planner</span>
					</Link>
				</div>
				<div className="hidden flex-1 items-center justify-between md:flex">
					<nav className="flex items-center space-x-6 text-sm font-medium">
						<Link
							href="/"
							className="transition-colors hover:text-foreground/80"
						>
							Home
						</Link>
						<Link
							href="/packing-list"
							className="transition-colors hover:text-foreground/80"
						>
							Packing List
						</Link>
						<Link
							href="/"
							className="transition-colors hover:text-foreground/80"
						>
							TBC
						</Link>
						<Link
							href="/about"
							className="transition-colors hover:text-foreground/80"
						>
							About
						</Link>
					</nav>
					<div className="flex items-center justify-end space-x-4 ml-auto px-4">
						<ThemeToggle />
						<Button variant="ghost" size="sm" asChild>
							<Link href="/login">Login</Link>
						</Button>
						<Button size="sm" asChild>
							<Link href="/signup">Sign Up</Link>
						</Button>
					</div>
				</div>

				<div className="flex flex-1 items-center justify-end md:hidden">
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="mr-2">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right">
							<div className="px-2">
								<Link
									href="/"
									className="flex items-center"
									onClick={() => setIsOpen(false)}
								>
									<span className="font-bold">Travel-Planner</span>
								</Link>
							</div>
							<nav className="mt-8 flex flex-col space-y-4">
								<Link
									href="/"
									className="block px-4 py-2 text-lg font-medium"
									onClick={() => setIsOpen(false)}
								>
									Home
								</Link>
								<Link
									href="/packinglist"
									className="block px-4 py-2 text-lg font-medium"
									onClick={() => setIsOpen(false)}
								>
									Packing List
								</Link>
								<Link
									href="/"
									className="block px-4 py-2 text-lg font-medium"
									onClick={() => setIsOpen(false)}
								>
									TBC
								</Link>
								<Link
									href="/about"
									className="block px-4 py-2 text-lg font-medium"
									onClick={() => setIsOpen(false)}
								>
									About
								</Link>
								<div className="mt-6 px-4 flex flex-col space-y-3">
									<Button
										variant="outline"
										asChild
										onClick={() => setIsOpen(false)}
									>
										<Link href="/login">Login</Link>
									</Button>
									<Button asChild onClick={() => setIsOpen(false)}>
										<Link href="/signup">Sign Up</Link>
									</Button>
								</div>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
