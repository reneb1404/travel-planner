import { TripDetailView } from "@/features/trips/components/trip-detail-view";
import { getTrip } from "@/features/trips/dal/queries";
import { notFound } from "next/navigation";

interface TripDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
	const { id } = await params; // Await params here
	const result = await getTrip(id);

	if (!result.success) {
		notFound();
	}

	return <TripDetailView trip={result.data} />;
}
