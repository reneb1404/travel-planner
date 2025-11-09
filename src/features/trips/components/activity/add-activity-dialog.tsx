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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { createNewActivity } from "../../dal/queries";
import { ActivityFormData, activitySchema } from "../../lib/validations";

interface AddActivityDialogProps {
	stopId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function AddActivityDialog({
	stopId,
	open,
	onOpenChange,
}: AddActivityDialogProps) {
	const [isAddingActivity, setIsAddingActivity] = useState(false);
	const router = useRouter();
	const today = new Date();

	const addActivityForm = useForm({
		resolver: zodResolver(activitySchema),
		defaultValues: {
			name: "",
			scheduledDate: today,
			scheduledTime: "00:00",
			durationMinutes: 0,
			notes: "",
			isCompleted: false,
		},
	});

	async function handleAddNewStop(data: ActivityFormData) {
		try {
			setIsAddingActivity(true);
			const result = await createNewActivity({
				name: data.name,
				scheduledDate: data.scheduledDate
					? data.scheduledDate.toISOString()
					: null,
				scheduledTime: data.scheduledTime,
				durationMinutes: data.durationMinutes,
				stopId: stopId,
				isCompleted: data.isCompleted,
				notes: data.notes,
			});

			if (result.success) {
				onOpenChange(false);
				addActivityForm.reset();
				router.refresh();
			}
		} finally {
			setIsAddingActivity(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add Activity</DialogTitle>
				</DialogHeader>
				<DialogDescription />

				<form onSubmit={addActivityForm.handleSubmit(handleAddNewStop)}>
					<FieldGroup>
						<Controller
							name="name"
							control={addActivityForm.control}
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
							control={addActivityForm.control}
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
							control={addActivityForm.control}
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
							control={addActivityForm.control}
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
							control={addActivityForm.control}
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
							control={addActivityForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<div className="flex items-center gap-3">
										<FieldLabel htmlFor="isCompleted">Completed</FieldLabel>
										<Checkbox
											id="isCompleted"
											className=""
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
								<LoadingSwap isLoading={isAddingActivity}>
									<span className="flex items-center gap-2">
										Add Stop Activity
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
