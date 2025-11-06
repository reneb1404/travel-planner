"use client";

import { Trip } from "@/drizzle/schemas/trip-schema";
import { TripCard } from "./trip-card";

interface TripListProps {
	trips: Trip[];
}

export function TripList({ trips }: TripListProps) {
	if (trips.length === 0) {
		return (
			<p className="text-gray-500 text-center py-8">
				No trips yet. Create your first trip!
			</p>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{trips.map((trip) => (
				<TripCard key={trip.id} trip={trip} />
			))}
		</div>
	);
}
