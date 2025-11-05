"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { Calendar, List, Menu, Plane, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { data: session } = authClient.useSession();

	const navLinks = [
		{ href: "/lists", label: "Packing List", icon: List },
		{ href: "/trips", label: "My Trips", icon: Calendar },
		{ href: "/explore", label: "Explore", icon: Plane },
	];

	return (
		<nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/80">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo with gradient effect */}
				<Link href="/" className="group flex items-center gap-2">
					<div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105">
						<Plane className="h-5 w-5 text-primary-foreground transition-transform duration-300 group-hover:rotate-12" />
					</div>
					<span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
						TravelPlan
					</span>
				</Link>
				{session == null ? (
					<>
						{/* Desktop Auth Buttons */}
						<div className="hidden items-center gap-3 md:flex">
							<Button
								variant="ghost"
								size="sm"
								className="relative overflow-hidden transition-all duration-300 hover:bg-primary/10"
							>
								<Link href="/auth/login">Sign In</Link>
							</Button>
							<Button
								size="sm"
								className="relative overflow-hidden bg-linear-to-r from-primary to-secondary shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
							>
								<Link href="/auth/signup" className="flex items-center gap-2">
									Sign Up
								</Link>
							</Button>
						</div>
					</>
				) : (
					<>
						{/* Desktop Navigation with hover effects */}
						<div className="hidden items-center gap-2 md:flex">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="group relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary/5 hover:text-foreground"
								>
									<link.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
									{link.label}
									<span className="absolute inset-x-0 -bottom-px h-0.5 scale-x-0 bg-linear-to-r from-primary to-secondary transition-transform duration-300 group-hover:scale-x-100" />
								</Link>
							))}
						</div>
						<div className="hidden items-center gap-3 md:flex">
							<div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium">
								<div className="h-2 w-2 rounded-full bg-linear-to-r from-primary to-secondary animate-pulse" />
								{session.user.name}
							</div>
							<Button
								size="sm"
								variant="outline"
								onClick={() => authClient.signOut()}
								className="transition-all duration-300 hover:border-destructive hover:text-destructive hover:bg-destructive/5"
							>
								Sign out
							</Button>
						</div>
					</>
				)}

				{/* Mobile Menu */}
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild className="md:hidden">
						<Button
							variant="ghost"
							size="icon"
							className="relative transition-all duration-300 hover:bg-primary/10"
						>
							<Menu className="h-5 w-5 transition-transform duration-300 hover:rotate-90" />
							<span className="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-full sm:w-[400px]">
						<SheetTitle className="sr-only">Navigation bar</SheetTitle>
						<div className="flex h-full flex-col justify-between py-6">
							{session == null ? (
								<>
									{/* Mobile Auth Section - Enhanced */}
									<div className="flex flex-1 flex-col items-center justify-center gap-6 px-4">
										<div className="text-center space-y-3">
											<div className="flex justify-center mb-4">
												<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary shadow-2xl shadow-primary/30">
													<Plane className="h-8 w-8 text-primary-foreground" />
												</div>
											</div>
											<h2 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
												Welcome!
											</h2>
											<p className="text-sm text-muted-foreground">
												Sign in to start planning your next adventure
											</p>
										</div>
										<div className="flex flex-col gap-3 w-full max-w-sm">
											<Button
												size="lg"
												onClick={() => setIsOpen(false)}
												className="bg-linear-to-r from-primary to-secondary shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105"
											>
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
												className="border-2 transition-all duration-300 hover:border-primary hover:bg-primary/5"
											>
												<Link
													href="/auth/signup"
													className="flex items-center gap-2"
												>
													Create Account
												</Link>
											</Button>
										</div>
									</div>
								</>
							) : (
								<>
									{/* Mobile Navigation Links - Enhanced */}
									<div className="flex flex-col gap-2 pt-8 px-2">
										{navLinks.map((link, index) => (
											<Link
												key={link.href}
												href={link.href}
												onClick={() => setIsOpen(false)}
												className="group flex items-center gap-4 rounded-2xl px-4 py-4 text-base font-medium text-foreground transition-all duration-300 hover:bg-linear-to-r hover:from-primary/10 hover:to-secondary/10 active:scale-[0.98]"
												style={{ animationDelay: `${index * 50}ms` }}
											>
												<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
													<link.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
												</div>
												<span className="flex-1">{link.label}</span>
												<div className="h-2 w-2 rounded-full bg-primary/0 transition-all duration-300 group-hover:bg-primary" />
											</Link>
										))}
									</div>

									{/* User Section at Bottom - Enhanced */}
									<div className="border-t border-border/40 pt-6 px-2 space-y-2">
										<Link
											href="/profile"
											onClick={() => setIsOpen(false)}
											className="group flex items-center gap-4 rounded-2xl px-4 py-4 text-base font-medium text-foreground transition-all duration-300 hover:bg-linear-to-r hover:from-primary/10 hover:to-secondary/10 active:scale-[0.98]"
										>
											<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20">
												<User className="h-5 w-5 text-primary" />
											</div>
											<span className="flex-1">Profile</span>
										</Link>
										<Button
											variant="ghost"
											className="group w-full justify-start gap-4 h-auto rounded-2xl px-4 py-4 text-base font-medium transition-all duration-300 hover:bg-destructive/10"
											onClick={async () => {
												await authClient.signOut();
												setIsOpen(false);
											}}
										>
											<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-destructive/20">
												<User className="h-5 w-5 text-destructive" />
											</div>
											<span className="flex-1">Sign Out</span>
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
