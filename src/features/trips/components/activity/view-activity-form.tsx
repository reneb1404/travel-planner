"use client";

import { Button } from "@/components/ui/button";
import { Activity } from "@/drizzle/schema";
import { useState } from "react";
import AddActivityDialog from "./add-activity-dialog";
import DeleteActivityButton from "./delete-activity-button";
import EditActivityButton from "./edit-activity-button";

interface ActivityViewFormProps {
	activities: Array<Activity>;
	stopId: string;
}

export default function ActivityViewForm({
	activities,
	stopId,
}: ActivityViewFormProps) {
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
		<div className="mt-4">
			<h4 className="font-medium mb-3 flex justify-between items-center">
				<span>Activities</span>
				<Button
					onClick={() => setIsActivityOpen(true)}
					variant="outline"
					size="sm"
				>
					Add Activity
				</Button>
			</h4>
			<ul className="space-y-2">
				{activities.map((activity) => (
					<li
						key={activity.id}
						className={`flex justify-between items-start pl-4 py-2 border-l-2 ${
							activity.isCompleted
								? "border-green-400 bg-green-50"
								: "border-blue-300"
						} hover:bg-gray-50 rounded`}
					>
						<div className="flex-1">
							<div
								className={`font-medium ${
									activity.isCompleted ? "line-through text-gray-500" : ""
								}`}
							>
								{activity.name}
							</div>
							{activity.notes && (
								<div className="text-sm text-gray-600">{activity.notes}</div>
							)}
							<div className="text-xs text-gray-500 mt-1 space-x-3">
								{activity.scheduledDate && (
									<span>📅 {formatDate(activity.scheduledDate)}</span>
								)}
								{activity.scheduledTime && (
									<span>🕐 {activity.scheduledTime}</span>
								)}
								{activity.durationMinutes && (
									<span>⏱️ {activity.durationMinutes} min</span>
								)}
							</div>
						</div>
						<div className="flex gap-1">
							<EditActivityButton stopId={stopId} activity={activity} />
							<DeleteActivityButton stopId={stopId} activityId={activity.id} />
						</div>
					</li>
				))}
			</ul>
			{/* Open Add Activity */}
			<AddActivityDialog
				stopId={stopId}
				open={isAddActivityOpen}
				onOpenChange={setIsActivityOpen}
			/>
		</div>
	);
}
