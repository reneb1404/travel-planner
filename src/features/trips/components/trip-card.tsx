"use client";

import { Button } from "@/components/ui/button";
import { Trip } from "@/drizzle/schemas/trip-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTrip } from "../dal/queries";

export function TripCard({ trip }: { trip: Trip }) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		if (!confirm("Are you sure you want to delete this trip?")) return;

		setIsDeleting(true);
		try {
			const res = await deleteTrip(trip.id);
			if (!res.success) {
				toast.error(res.error);
			}
			toast.success("Trip deleted");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<div className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition">
			<h3 className="font-semibold text-lg mb-2">{trip.name}</h3>
			<p className="text-sm text-gray-600 mb-2">
				{trip.startDate} → {trip.endDate}
			</p>
			{trip.notes && <p className="text-sm text-gray-700 mb-3">{trip.notes}</p>}

			<div className="flex gap-2">
				<Button
					onClick={() => router.push(`/trips/${trip.id}`)}
					className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
				>
					View
				</Button>
				<Button
					onClick={handleDelete}
					disabled={isDeleting}
					className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
				>
					{isDeleting ? "Deleting..." : "Delete"}
				</Button>
			</div>
		</div>
	);
}
