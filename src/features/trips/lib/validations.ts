import * as z from "zod";

export const tripSchema = z.object({
	name: z.string().min(1, "Stop name is required"),
	startDate: z.date(),
	endDate: z.date(),
	notes: z.string(),
});

export type TripFormData = z.infer<typeof tripSchema>;

export const stopSchema = z.object({
	name: z.string().min(1, "Stop name is required"),
	startDate: z.date(),
	endDate: z.date(),
	orderIndex: z.int().min(1, "Order index is required"),
	notes: z.string(),
});

export type StopFormData = z.infer<typeof stopSchema>;

export const activitySchema = z.object({
	name: z.string().min(1, "Stop name is required"),
	scheduledDate: z.date(),
	durationMinutes: z.int(),
	notes: z.string(),
	isCompleted: z.boolean(),
});

export type ActivityFormData = z.infer<typeof activitySchema>;
