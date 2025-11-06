import { CreateTripButton } from "@/features/trips/components/trip-button";
import { TripList } from "@/features/trips/components/trips-list";
import { getUserTrips } from "@/features/trips/dal/queries";

export default async function TripPage() {
	const result = await getUserTrips();

	if (!result.success) {
		return (
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-4">My Trips</h1>
				<p className="text-red-500">{result.error}</p>
			</div>
		);
	}

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">My Trips</h1>
				<CreateTripButton />
			</div>

			{result.data.length === 0 ? (
				<p className="text-gray-500">No trips yet. Create your first trip!</p>
			) : (
				<TripList trips={result.data} />
			)}
		</div>
	);
}
