import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PackingListForm() {
	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create packing list</CardTitle>
				<CardDescription>
					Create your new packing list in one-click.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">Name</Label>
							<Input id="name" placeholder="Name of your packing list" />
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="items">Items</Label>
							<Input id="items" placeholder="Item1, Item2,..." />
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Create</Button>
			</CardFooter>
		</Card>
	);
}
