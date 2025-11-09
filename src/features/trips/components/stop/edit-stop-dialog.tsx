"use client";
import { Button } from "@/components/ui/button";
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
import { Stop } from "@/drizzle/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateStop } from "../../dal/queries";
import { StopFormData, stopSchema } from "../../lib/validations";

interface UpdateStopDialogProps {
	stop: Stop;
	tripId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export default function StopEditDialog({
	stop,
	tripId,
	open,
	onOpenChange,
}: UpdateStopDialogProps) {
	const [isUpdatingStop, setIsUpdatingStop] = useState(false);
	const router = useRouter();
	const updateStopForm = useForm({
		resolver: zodResolver(stopSchema),
		defaultValues: {
			name: stop.name,
			startDate: stop.startDate ? new Date(stop.startDate) : new Date(),
			endDate: stop.endDate ? new Date(stop.endDate) : new Date(),
			orderIndex: stop.orderIndex,
			notes: stop.notes ? stop.notes : "",
		},
	});

	async function handleUpdateStop(data: StopFormData) {
		try {
			setIsUpdatingStop(true);
			const result = await updateStop(stop.id, tripId, {
				name: data.name,
				startDate: data.startDate.toISOString(),
				endDate: data.endDate.toISOString(),
				orderIndex: data.orderIndex,
				notes: data.notes,
			});

			if (!result.success) {
				toast.error(result.error);
			}

			router.refresh();
			toast.success("Stop updated");
			onOpenChange(false);
		} finally {
			setIsUpdatingStop(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Add Trip Stop</DialogTitle>
				</DialogHeader>
				<DialogDescription />
				<form onSubmit={updateStopForm.handleSubmit(handleUpdateStop)}>
					<FieldGroup>
						<Controller
							name="name"
							control={updateStopForm.control}
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
							control={updateStopForm.control}
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
							control={updateStopForm.control}
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
							control={updateStopForm.control}
							render={({ field, fieldState }) => (
								<Field aria-invalid={fieldState.invalid}>
									<FieldLabel htmlFor="orderIndex">Order</FieldLabel>
									<Input
										{...field}
										id="orderIndex"
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
							control={updateStopForm.control}
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
								<LoadingSwap isLoading={isUpdatingStop}>
									<span className="flex items-center gap-2">
										Update Trip Stop
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
