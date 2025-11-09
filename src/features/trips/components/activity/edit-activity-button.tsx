"use client";
import { Button } from "@/components/ui/button";
import { Activity } from "@/drizzle/schema";
import { Pencil } from "lucide-react";
import { useState } from "react";
import EditActivityDialog from "./edit-activity-dialog";

interface EditActivityProps {
	stopId: string;
	activity: Activity;
}

export default function EditActivityButton({
	stopId,
	activity,
}: EditActivityProps) {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
				<Pencil className="w-4 h-4" />
			</Button>

			{/* Edit Stop Dialog */}
			<EditActivityDialog
				stopId={stopId}
				activity={activity}
				open={isEditing}
				onOpenChange={setIsEditing}
			/>
		</>
	);
}
