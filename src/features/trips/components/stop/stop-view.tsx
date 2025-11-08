import { Button } from "@/components/ui/button";
import { Activity, Stop } from "@/drizzle/schema";
import { Pencil, Trash2 } from "lucide-react";

interface StopViewProps {
	stop: Stop & { activities?: Activity[] };
}

export default function StopView({ stop }: StopViewProps) {
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
					<Button variant="ghost" size="sm">
						<Pencil className="w-4 h-4" />
					</Button>
					<Button variant="ghost" size="sm">
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{stop.notes && <p className="text-gray-700 mb-4">{stop.notes}</p>}
		</>
	);
}
