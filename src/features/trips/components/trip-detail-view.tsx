"use client";

import { Button } from "@/components/ui/button";
import { Activity, Stop, Trip } from "@/drizzle/schemas/trip-schema";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTrip } from "../dal/queries";
import AddStopDialog from "./stop/add-stop-dialog";
import StopView from "./stop/stop-view";
import { EditTripDialog } from "./trip-edit-dialog";

interface TripDetailViewProps {
	trip: Trip & {
		stops?: Array<Stop & { activities?: Activity[] }>;
	};
}

export function TripDetailView({ trip }: TripDetailViewProps) {
	const router = useRouter();
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isAddStopOpen, setIsAddStopOpen] = useState(false);

	async function handleDelete() {
		if (!confirm("Are you sure you want to delete this trip?")) return;

		try {
			setIsDeleting(true);
			const res = await deleteTrip(trip.id);
			if (!res.success) {
				toast.error(res.error);
			}
			toast.success("Trip deleted");
		} finally {
			setIsDeleting(false);
		}
	}

	function formatDate(date: string | null) {
		if (!date) return null;
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	function formatTime(time: string | null) {
		if (!time) return null;
		return time; // Already in HH:MM format
	}

	return (
		<div className="p-8 max-w-4xl mx-auto">
			{/* Header */}
			<div className="mb-6">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.back()}
					className="mb-4"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Trips
				</Button>

				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-3xl font-bold mb-2">{trip.name}</h1>
						<p className="text-gray-600">
							{formatDate(trip.startDate)} → {formatDate(trip.endDate)}
						</p>
					</div>

					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditOpen(true)}
						>
							<Pencil className="w-4 h-4 mr-2" />
							Edit
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							<Trash2 className="w-4 h-4 mr-2" />
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</div>
			</div>

			{/* Trip Details */}
			<div className="bg-white rounded-lg shadow p-6 mb-6">
				<h2 className="text-xl font-semibold mb-4">Trip Details</h2>
				{trip.notes ? (
					<p className="text-gray-700">{trip.notes}</p>
				) : (
					<p className="text-gray-500 italic">No notes provided</p>
				)}
			</div>

			{/* Stops Section */}
			{trip.stops && trip.stops.length > 0 ? (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">Stops</h2>
						<Button
							onClick={() => setIsAddStopOpen(true)}
							variant="outline"
							size="sm"
						>
							Add Stop
						</Button>
					</div>

					{trip.stops.map((stop) => (
						<div key={stop.id} className="bg-white rounded-lg shadow p-6">
							<StopView tripId={trip.id} stop={stop} />

							{/* Activities */}
							{stop.activities && stop.activities.length > 0 ? (
								<div className="mt-4">
									<h4 className="font-medium mb-3 flex justify-between items-center">
										<span>Activities</span>
										<Button variant="ghost" size="sm">
											Add Activity
										</Button>
									</h4>
									<ul className="space-y-2">
										{stop.activities.map((activity) => (
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
															activity.isCompleted
																? "line-through text-gray-500"
																: ""
														}`}
													>
														{activity.name}
													</div>
													{activity.notes && (
														<div className="text-sm text-gray-600">
															{activity.notes}
														</div>
													)}
													<div className="text-xs text-gray-500 mt-1 space-x-3">
														{activity.scheduledDate && (
															<span>
																📅 {formatDate(activity.scheduledDate)}
															</span>
														)}
														{activity.scheduledTime && (
															<span>
																🕐 {formatTime(activity.scheduledTime)}
															</span>
														)}
														{activity.durationMinutes && (
															<span>⏱️ {activity.durationMinutes} min</span>
														)}
													</div>
												</div>
												<div className="flex gap-1">
													<Button variant="ghost" size="sm">
														<Pencil className="w-3 h-3" />
													</Button>
													<Button variant="ghost" size="sm">
														<Trash2 className="w-3 h-3" />
													</Button>
												</div>
											</li>
										))}
									</ul>
								</div>
							) : (
								<p className="text-gray-500 text-sm italic mt-4">
									No activities added yet
								</p>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="bg-white rounded-lg shadow p-6 text-center">
					<p className="text-gray-500 mb-4">No stops added yet</p>
					<Button onClick={() => setIsAddStopOpen(true)} variant="outline">
						Add Your First Stop
					</Button>
				</div>
			)}

			{/* Edit Dialog */}
			<EditTripDialog
				trip={trip}
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
			/>

			{/* Add Stop Dialog */}
			<AddStopDialog
				tripId={trip.id}
				open={isAddStopOpen}
				onOpenChange={setIsAddStopOpen}
			/>
		</div>
	);
}
