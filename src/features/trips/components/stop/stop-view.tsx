import { Stop } from "@/drizzle/schema";
import StopDeleteButton from "./stop-delete-button";
import StopEditButton from "./stop-edit-button";

interface StopViewProps {
	tripId: string;
	stop: Stop;
}

export default function StopView({ tripId, stop }: StopViewProps) {
	function formatDate(date: string | null) {
		if (!date) return null;
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	return (
		<>
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="text-lg font-semibold">{stop.name}</h3>
					{stop.startDate && stop.endDate && (
						<p className="text-sm text-gray-600">
							{formatDate(stop.startDate)} → {formatDate(stop.endDate)}
						</p>
					)}
				</div>
				<div className="flex gap-2">
					<StopEditButton tripId={tripId} stop={stop} />
					<StopDeleteButton tripId={tripId} stopId={stop.id} />
				</div>
			</div>

			{stop.notes && <p className="text-gray-700 mb-4">{stop.notes}</p>}
		</>
	);
}
