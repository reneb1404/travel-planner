"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { Calendar, MapPin, Menu, Plane, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = authClient.useSession();

	const navLinks = [
		{ href: "/destinations", label: "Destinations", icon: MapPin },
		{ href: "/trips", label: "My Trips", icon: Calendar },
		{ href: "/explore", label: "Explore", icon: Plane },
	];

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-border bg-muted backdrop-blur supports-backdrop-filter:bg-muted/95">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
						<Plane className="h-5 w-5 text-primary-foreground" />
					</div>
					<span className="text-xl font-semibold text-foreground">
						TravelPlan
					</span>
				</Link>
				{session == null ? (
					<>
						{/* Desktop Auth Buttons */}
						<div className="hidden items-center gap-3 md:flex">
							<Button variant="ghost" size="sm">
								<Link href="/auth/login">Sign In</Link>
							</Button>
							<Button size="sm">
								<Link href="/auth/signup">Sign Up</Link>
							</Button>
						</div>
					</>
				) : (
					<>
						{/* Desktop Navigation */}
						<div className="hidden items-center gap-8 md:flex">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
								>
									<link.icon className="h-4 w-4" />
									{link.label}
								</Link>
							))}
						</div>
						<div className="hidden items-center gap-3 md:flex">
							Hello, {session.user.name}
							<Button size="sm" onClick={() => authClient.signOut()}>
								Sign out
							</Button>
						</div>
					</>
				)}

				{/* Mobile Menu */}
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild className="md:hidden">
						<Button variant="ghost" size="icon">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-full sm:w-[400px]">
						<SheetTitle className="sr-only">Navigation bar</SheetTitle>
						<div className="flex h-full flex-col justify-between py-6">
							{session == null ? (
								<>
									{/* Mobile Auth Section - Centered */}
									<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
										<div className="text-center space-y-2">
											<h2 className="text-2xl font-semibold">Welcome!</h2>
											<p className="text-sm text-muted-foreground">
												Sign in to start planning your next adventure
											</p>
										</div>
										<div className="flex flex-col gap-3 w-full max-w-sm">
											<Button size="lg" onClick={() => setIsOpen(false)}>
												<Link
													href="/auth/login"
													className="flex items-center gap-2"
												>
													<User className="h-4 w-4" />
													Sign In
												</Link>
											</Button>
											<Button
												variant="outline"
												size="lg"
												onClick={() => setIsOpen(false)}
											>
												<Link href="/auth/signup">Create Account</Link>
											</Button>
										</div>
									</div>
								</>
							) : (
								<>
									{/* Mobile Navigation Links - Spaced Out */}
									<div className="flex flex-col gap-2 pt-8 px-2">
										{navLinks.map((link) => (
											<Link
												key={link.href}
												href={link.href}
												onClick={() => setIsOpen(false)}
												className="flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium text-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
											>
												<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
													<link.icon className="h-5 w-5 text-primary" />
												</div>
												{link.label}
											</Link>
										))}
									</div>

									{/* User Section at Bottom */}
									<div className="border-t border-border pt-6 px-2 space-y-2">
										<Link
											href="/profile"
											onClick={() => setIsOpen(false)}
											className="flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium text-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
										>
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
												<User className="h-5 w-5 text-primary" />
											</div>
											Profile
										</Link>
										<Button
											variant="ghost"
											className="w-full justify-start gap-4 h-auto rounded-xl px-4 py-4 text-base font-medium"
											onClick={async () => {
												await authClient.signOut();
												setIsOpen(false);
											}}
										>
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
												<User className="h-5 w-5 text-destructive" />
											</div>
											Sign Out
										</Button>
									</div>
								</>
							)}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
