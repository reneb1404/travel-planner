"use client";
import { Button } from "@/components/ui/button";
import { Stop, trip } from "@/drizzle/schema";
import { Pencil } from "lucide-react";
import { useState } from "react";
import StopEditDialog from "./edit-stop-dialog";

interface StopEditProps {
	tripId: string;
	stop: Stop;
}

export default function EditStopButton({ tripId, stop }: StopEditProps) {
	const [isEditing, setIsEditing] = useState(false);

	return (
		<>
			<Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
				<Pencil className="w-4 h-4" />
			</Button>

			{/* Edit Stop Dialog */}
			<StopEditDialog
				tripId={tripId}
				stop={stop}
				open={isEditing}
				onOpenChange={setIsEditing}
			/>
		</>
	);
}
