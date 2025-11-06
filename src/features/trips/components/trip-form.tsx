"use client";

import { randomUUID } from "crypto";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { addNewTrip } from "../dal/queries";

export function CreateTripForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		setError(null);

		const data = {
			id: randomUUID(),
			name: formData.get("name") as string,
			startDate: formData.get("startDate") as string,
			endDate: formData.get("endDate") as string,
			description: (formData.get("description") as string) || null,
		};

		startTransition(async () => {
			const result = await addNewTrip(data);

			if (result.success) {
				router.push("/trips");
				router.refresh();
			} else {
				setError(result.error);
			}
		});
	}

	return (
		<form action={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="name" className="block text-sm font-medium mb-1">
					Trip Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					required
					disabled={isPending}
					className="w-full px-3 py-2 border rounded-md"
					placeholder="Road trip to Italy"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label htmlFor="startDate" className="block text-sm font-medium mb-1">
						Start Date
					</label>
					<input
						type="date"
						id="startDate"
						name="startDate"
						required
						disabled={isPending}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>

				<div>
					<label htmlFor="endDate" className="block text-sm font-medium mb-1">
						End Date
					</label>
					<input
						type="date"
						id="endDate"
						name="endDate"
						required
						disabled={isPending}
						className="w-full px-3 py-2 border rounded-md"
					/>
				</div>
			</div>

			<div>
				<label htmlFor="description" className="block text-sm font-medium mb-1">
					Description (optional)
				</label>
				<textarea
					id="description"
					name="description"
					disabled={isPending}
					rows={3}
					className="w-full px-3 py-2 border rounded-md"
					placeholder="Tell us about your trip..."
				/>
			</div>

			{error && (
				<div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
					{error}
				</div>
			)}

			<button
				type="submit"
				disabled={isPending}
				className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
			>
				{isPending ? "Creating..." : "Create Trip"}
			</button>
		</form>
	);
}
