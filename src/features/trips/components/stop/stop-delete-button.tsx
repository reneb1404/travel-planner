"use client";

import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteStop } from "../../dal/queries";

interface StopViewProps {
	tripId: string;
	stopId: string;
}

export default function StopDeleteButton({ tripId, stopId }: StopViewProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleStopDelete() {
		if (!confirm("Are you sure you want to delete this stop?")) return;

		try {
			setIsDeleting(true);
			const res = await deleteStop(tripId, stopId);

			if (!res.success) {
				toast.error(res.error);
			}

			toast.success("Stop deleted");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Button onClick={handleStopDelete} variant="ghost" size="sm">
			<LoadingSwap isLoading={isDeleting}>
				<Trash2 className="w-4 h-4" />
			</LoadingSwap>
		</Button>
	);
}
