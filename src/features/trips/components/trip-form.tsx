"use client";

import { Button } from "@/components/ui/button";
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
import { addNewTrip } from "../dal/queries";
import { TripFormData, tripSchema } from "../lib/validations";

export function CreateTripForm() {
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	const tripForm = useForm({
		resolver: zodResolver(tripSchema),
		defaultValues: {
			name: "",
			startDate: today,
			endDate: tomorrow,
			notes: "",
		},
	});

	async function createNewTrip(data: TripFormData) {
		try {
			setIsCreating(true);
			const result = await addNewTrip({
				name: data.name,
				startDate: data.startDate?.toISOString(),
				endDate: data.endDate?.toISOString(),
				notes: data.notes,
			});

			if (result.success) {
				tripForm.reset();
				router.push("/trips");
				router.refresh();
			}
		} finally {
			setIsCreating(false);
		}
	}

	return (
		<form onSubmit={tripForm.handleSubmit(createNewTrip)}>
			<FieldGroup>
				<Controller
					name="name"
					control={tripForm.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="name">Trip Name</FieldLabel>
							<Input
								id="name"
								{...field}
								aria-invalid={fieldState.invalid}
								required
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="startDate"
					control={tripForm.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="startDate">Start Date</FieldLabel>
							<Input
								id="startDate"
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="endDate"
					control={tripForm.control}
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
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>

				<Controller
					name="notes"
					control={tripForm.control}
					render={({ field, fieldState }) => (
						<Field data-invalid={fieldState.invalid}>
							<FieldLabel htmlFor="notes">Notes</FieldLabel>
							<Textarea
								id="notes"
								{...field}
								aria-invalid={fieldState.invalid}
								required
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</Field>
					)}
				/>
				<Field>
					<Button type="submit">
						<LoadingSwap isLoading={isCreating}>
							<span className="flex items-center gap-2">Create Trip</span>
						</LoadingSwap>
					</Button>
				</Field>
			</FieldGroup>
		</form>
	);
}
