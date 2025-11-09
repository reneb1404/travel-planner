"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "@/drizzle/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateActivity } from "../../dal/queries";
import { ActivityFormData, activitySchema } from "../../lib/validations";

interface EditActivityDialogProps {
	activity: Activity;
	stopId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function EditActivityDialog({
	activity,
	stopId,
	open,
	onOpenChange,
}: EditActivityDialogProps) {
	const [isUpdatingActivity, setIsUpdatingActivity] = useState(false);
	const router = useRouter();

	const updateActivityForm = useForm({
		resolver: zodResolver(activitySchema),
		defaultValues: {
			name: activity.name,
			scheduledDate: activity.scheduledDate
				? new Date(activity.scheduledDate)
				: null,
			scheduledTime: activity.scheduledTime ? activity.scheduledTime : "00:00",
			durationMinutes: activity.durationMinutes ? activity.durationMinutes : 0,
			notes: activity.notes ? activity.notes : "",
			isCompleted: activity.isCompleted,
		},
	});

	async function handleUpdateActivity(data: ActivityFormData) {
		try {
			setIsUpdatingActivity(true);
			const result = await updateActivity(stopId, activity.id, {
				name: data.name,
				scheduledDate: data.scheduledDate
					? data.scheduledDate.toISOString()
					: null,
				scheduledTime: data.scheduledTime || null,
				durationMinutes: data.durationMinutes || 0,
				isCompleted: data.isCompleted,
				notes: data.notes || "",
			});

			if (!result.success) {
				toast.error(result.error);
			}

			router.refresh();
			toast.success("Activity updated");
			onOpenChange(false);
		} finally {
			setIsUpdatingActivity(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add Activity</DialogTitle>
				</DialogHeader>
				<DialogDescription></DialogDescription>

				<form onSubmit={updateActivityForm.handleSubmit(handleUpdateActivity)}>
					<FieldGroup>
						<Controller
							name="name"
							control={updateActivityForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Activity Name</FieldLabel>
									<Input
										{...field}
										id="name"
										aria-invalid={fieldState.invalid}
										required
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="scheduledDate"
							control={updateActivityForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="scheduledDate">
										Scheduled Date
									</FieldLabel>
									<Input
										id="scheduledDate"
										type="date"
										value={
											field.value ? field.value.toISOString().split("T")[0] : ""
										}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value ? new Date(value) : null);
										}}
										aria-invalid={fieldState.invalid}
										required
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="scheduledTime"
							control={updateActivityForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="scheduledTime">
										Scheduled Time
									</FieldLabel>
									<Input
										id="scheduledTime"
										type="time"
										{...field}
										aria-invalid={fieldState.invalid}
										required
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="durationMinutes"
							control={updateActivityForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="durationMinutes">
										Duration (minutes)
									</FieldLabel>
									<Input
										{...field}
										id="durationMinutes"
										type="number"
										value={field.value}
										onChange={(e) => field.onChange(Number(e.target.value))}
										aria-invalid={fieldState.invalid}
										required
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="notes"
							control={updateActivityForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="notes">Notes</FieldLabel>
									<Textarea
										{...field}
										id="notes"
										aria-invalid={fieldState.invalid}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="isCompleted"
							control={updateActivityForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<div className="flex items-center gap-3">
										<FieldLabel htmlFor="isCompleted">Completed</FieldLabel>
										<Checkbox
											id="isCompleted"
											checked={field.value}
											onCheckedChange={(checked) => field.onChange(checked)}
											aria-invalid={fieldState.invalid}
										/>
									</div>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Field>
							<Button type="submit">
								<LoadingSwap isLoading={isUpdatingActivity}>
									<span className="flex items-center gap-2">
										Update Activity
									</span>
								</LoadingSwap>
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
}
