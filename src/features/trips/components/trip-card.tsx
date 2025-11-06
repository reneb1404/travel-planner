"use client";

import { Trip } from "@/drizzle/schemas/trip-schema";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTrip, updateTrip } from "../dal/queries";

export function TripCard({ trip }: { trip: Trip }) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	function handleDelete() {
		if (!confirm("Are you sure you want to delete this trip?")) return;

		startTransition(async () => {
			const result = await deleteTrip(trip.id);
			if (!result.success) {
				setError(result.error);
			}
		});
	}

	async function handleUpdate(formData: FormData) {
		setError(null);

		const data = {
			name: formData.get("title") as string,
			description: (formData.get("description") as string) || null,
		};

		startTransition(async () => {
			const result = await updateTrip(trip.id, data);

			if (result.success) {
				setIsEditing(false);
			} else {
				setError(result.error);
			}
		});
	}

	if (isEditing) {
		return (
			<div className="border rounded-lg p-4 bg-white shadow">
				<form action={handleUpdate} className="space-y-3">
					<input
						type="text"
						name="name"
						defaultValue={trip.name}
						disabled={isPending}
						className="w-full px-3 py-2 border rounded"
					/>
					<textarea
						name="notes"
						defaultValue={trip.notes || ""}
						disabled={isPending}
						rows={2}
						className="w-full px-3 py-2 border rounded"
					/>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<div className="flex gap-2">
						<button
							type="submit"
							disabled={isPending}
							className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
						>
							Save
						</button>
						<button
							type="button"
							onClick={() => setIsEditing(false)}
							disabled={isPending}
							className="px-3 py-1 bg-gray-200 rounded text-sm"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		);
	}

	return (
		<div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
			<h3 className="font-semibold text-lg mb-2">{trip.name}</h3>
			<p className="text-sm text-gray-600 mb-2">
				{trip.startDate} → {trip.endDate}
			</p>
			{trip.notes && <p className="text-sm text-gray-700 mb-3">{trip.notes}</p>}

			<div className="flex gap-2">
				<button
					onClick={() => router.push(`/trips/${trip.id}`)}
					className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
				>
					View
				</button>
				<button
					onClick={() => setIsEditing(true)}
					disabled={isPending}
					className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
				>
					Edit
				</button>
				<button
					onClick={handleDelete}
					disabled={isPending}
					className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
				>
					{isPending ? "Deleting..." : "Delete"}
				</button>
			</div>
			{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
		</div>
	);
}
