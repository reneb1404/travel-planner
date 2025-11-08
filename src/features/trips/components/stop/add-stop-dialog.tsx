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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { addNewStop } from "../../dal/queries";
import { StopFormData, stopSchema } from "../../lib/validations";

interface AddStopDialogProps {
	tripId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function AddStopDialog({
	tripId,
	open,
	onOpenChange,
}: AddStopDialogProps) {
	const [isAddingStop, setIsAddingStop] = useState(false);
	const router = useRouter();
	const today = new Date();

	const addStopForm = useForm({
		resolver: zodResolver(stopSchema),
		defaultValues: {
			name: "",
			startDate: today,
			endDate: today,
			orderIndex: 0,
			notes: "",
		},
	});

	async function handleAddNewStop(data: StopFormData) {
		try {
			setIsAddingStop(true);
			const result = await addNewStop({
				name: data.name,
				startDate: data.startDate.toISOString(),
				endDate: data.endDate.toISOString(),
				orderIndex: data.orderIndex,
				notes: data.notes,
				tripId: tripId,
			});

			if (result.success) {
				addStopForm.reset();
				router.refresh();
			}
		} finally {
			setIsAddingStop(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add Trip Stop</DialogTitle>
				</DialogHeader>
				<form onSubmit={addStopForm.handleSubmit(handleAddNewStop)}>
					<FieldGroup>
						<Controller
							name="name"
							control={addStopForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="name">Stop Name</FieldLabel>
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
							name="startDate"
							control={addStopForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="startDate">Start Date</FieldLabel>
									<Input
										id="startDate"
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
							name="endDate"
							control={addStopForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="endDate">End Date</FieldLabel>
									<Input
										id="endDate"
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
							name="orderIndex"
							control={addStopForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="orderIndex">Order</FieldLabel>
									<Input
										{...field}
										id="orderIndex"
										type="number"
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
							control={addStopForm.control}
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
						<Field>
							<Button type="submit">
								<LoadingSwap isLoading={isAddingStop}>
									<span className="flex items-center gap-2">Add Trip Stop</span>
								</LoadingSwap>
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</DialogContent>
		</Dialog>
	);
}
