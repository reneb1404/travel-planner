"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
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
import { Trip } from "@/drizzle/schemas/trip-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { updateTrip } from "../dal/queries";
import { TripFormData, tripSchema } from "../lib/validations";

interface EditTripDialogProps {
	trip: Trip;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditTripDialog({
	trip,
	open,
	onOpenChange,
}: EditTripDialogProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const editTripForm = useForm({
		resolver: zodResolver(tripSchema),
		defaultValues: {
			name: trip.name,
			startDate: new Date(trip.startDate),
			endDate: new Date(trip.endDate),
			notes: trip.notes || "",
		},
	});

	async function editTrip(data: TripFormData) {
		try {
			setIsEditing(true);
			const result = await updateTrip(trip.id, {
				name: data.name,
				startDate: data.startDate.toISOString(),
				endDate: data.endDate.toISOString(),
				notes: data.notes,
			});

			if (result.success) {
				onOpenChange(false);
				router.refresh();
			}
		} finally {
			setIsEditing(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Trip</DialogTitle>
				</DialogHeader>
				<form onSubmit={editTripForm.handleSubmit(editTrip)}>
					<FieldGroup>
						<Controller
							name="name"
							control={editTripForm.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Trip Name</FieldLabel>
									<Input
										id="name"
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
							name="startDate"
							control={editTripForm.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="startDate">Start Date</FieldLabel>
									<Input
										id="startDate"
										type="date"
										aria-invalid={fieldState.invalid}
										required
										value={
											field.value ? field.value.toISOString().split("T")[0] : ""
										}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value ? new Date(value) : null);
										}}
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="endDate"
							control={editTripForm.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="endDate">End Date</FieldLabel>
									<Input
										id="endDate"
										value={
											field.value ? field.value.toISOString().split("T")[0] : ""
										}
										onChange={(e) => {
											const value = e.target.value;
											field.onChange(value ? new Date(value) : null);
										}}
										type="date"
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
							control={editTripForm.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="notes">Notes</FieldLabel>
									<Textarea
										id="notes"
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
						<Field>
							<Button type="submit">
								<LoadingSwap isLoading={isEditing}>
									<span className="flex items-center gap-2">Edit Trip</span>
								</LoadingSwap>
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
}
