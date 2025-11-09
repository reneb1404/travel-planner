"use client";
import { Button } from "@/components/ui/button";
import { Activity, Stop } from "@/drizzle/schema";
import { useState } from "react";
import AddActivityDialog from "../activity/add-activity-dialog";
import ActivityViewForm from "../activity/view-activity-form";
import DeleteStopButton from "./delete-stop-button";
import StopEditButton from "./edit-stop-button";

interface StopViewProps {
	tripId: string;
	stop: Stop & { activities?: Activity[] };
}

export default function ViewStopForm({ tripId, stop }: StopViewProps) {
	const [isAddActivityOpen, setIsActivityOpen] = useState(false);
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
					<DeleteStopButton tripId={tripId} stopId={stop.id} />
				</div>
			</div>

			{stop.notes && <p className="text-gray-700 mb-4">{stop.notes}</p>}

			{/* Activities */}
			{stop.activities && stop.activities.length > 0 ? (
				<ActivityViewForm activities={stop.activities} stopId={stop.id} />
			) : (
				<div className="flex justify-between">
					<p className="text-gray-500 text-sm italic mt-4">
						No activities added yet
					</p>
					<Button
						onClick={() => setIsActivityOpen(true)}
						variant="outline"
						size="sm"
					>
						Add Activity
					</Button>
				</div>
			)}
			{/* Open Add Activity */}
			<AddActivityDialog
				stopId={stop.id}
				open={isAddActivityOpen}
				onOpenChange={setIsActivityOpen}
			/>
		</>
	);
}
