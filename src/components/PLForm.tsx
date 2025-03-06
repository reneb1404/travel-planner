"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface PackingItem {
	id: string;
	name: string;
	quantity: number;
}

export default function PackagingListForm() {
	const [listName, setListName] = useState("");
	const [items, setItems] = useState<PackingItem[]>([
		{ id: "1", name: "", quantity: 1 },
	]);

	const addItem = () => {
		const newId = String(Date.now());
		setItems([...items, { id: newId, name: "", quantity: 1 }]);
	};

	const removeItem = (id: string) => {
		if (items.length > 1) {
			setItems(items.filter((item) => item.id !== id));
		}
	};

	const updateItem = (
		id: string,
		field: keyof PackingItem,
		value: string | number
	) => {
		setItems(
			items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
		);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Here you would typically save the packing list
		console.log({
			name: listName,
			items: items,
		});

		// For demo purposes, alert the user
		alert(`Packing list "${listName}" created with ${items.length} items!`);
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<form onSubmit={handleSubmit}>
				<CardHeader>
					<CardTitle className="text-2xl">Create Packing List</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="list-name">List Name</Label>
						<Input
							id="list-name"
							placeholder="e.g., Summer Vacation 2024"
							value={listName}
							onChange={(e) => setListName(e.target.value)}
							required
						/>
					</div>

					<div className="space-y-4 pb-5">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium">Items</h3>
						</div>

						{items.map((item) => (
							<div key={item.id} className="grid grid-cols-12 gap-3 items-end">
								<div className="col-span-7 sm:col-span-8">
									<Label htmlFor={`item-name-${item.id}`} className="sr-only">
										Item Name
									</Label>
									<Input
										id={`item-name-${item.id}`}
										placeholder="Item name"
										value={item.name}
										onChange={(e) =>
											updateItem(item.id, "name", e.target.value)
										}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addItem();
											}
										}}
										required
									/>
								</div>
								<div className="col-span-3 sm:col-span-3">
									<Label
										htmlFor={`item-quantity-${item.id}`}
										className="sr-only"
									>
										Quantity
									</Label>
									<Input
										id={`item-quantity-${item.id}`}
										type="number"
										min="1"
										placeholder="Qty"
										value={item.quantity}
										onChange={(e) =>
											updateItem(
												item.id,
												"quantity",
												Number.parseInt(e.target.value) || 1
											)
										}
										required
									/>
								</div>
								<div className="col-span-2 sm:col-span-1">
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => removeItem(item.id)}
										disabled={items.length === 1}
										className="h-10 w-10"
									>
										<Trash2 className="h-4 w-4" />
										<span className="sr-only">Remove item</span>
									</Button>
								</div>
							</div>
						))}

						<Button
							type="button"
							variant="outline"
							size="sm"
							className="mt-2"
							onClick={addItem}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Item
						</Button>
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" className="w-full">
						Create Packing List
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
