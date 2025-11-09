import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteActivity } from "../../dal/queries";

interface DeleteActivityButtonProps {
	activityId: string;
	stopId: string;
}

export default function DeleteActivityButton({
	activityId,
	stopId,
}: DeleteActivityButtonProps) {
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDeleteActivity() {
		if (!confirm("Are you sure you want to delete this activity?")) return;

		try {
			setIsDeleting(true);
			const res = await deleteActivity(stopId, activityId);

			if (!res.success) {
				toast.error(res.error);
			}

			toast.success("Activity deleted");
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Button onClick={handleDeleteActivity} variant="ghost" size="sm">
			<LoadingSwap isLoading={isDeleting}>
				<Trash2 className="w-3 h-3" />
			</LoadingSwap>
		</Button>
	);
}
