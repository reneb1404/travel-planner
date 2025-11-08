"use server";

import { db } from "@/drizzle/db";
import {
	activity,
	NewStop,
	NewTrip,
	stop,
	Stop,
	Trip,
	trip,
} from "@/drizzle/schemas/trip-schema";
import { requireAuth } from "@/features/auth/dal/queries";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type ActionResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

export async function addNewTrip(
	data: Omit<NewTrip, "userId">
): Promise<ActionResult<Trip>> {
	const user = await requireAuth();
	try {
		const [newTrip] = await db
			.insert(trip)
			.values({ ...data, userId: user.id })
			.returning();

		if (!newTrip) {
			return { success: false, error: "Failed to create trip" };
		}

		revalidatePath("/trips");
		return { success: true, data: newTrip };
	} catch (error) {
		console.error("Error creating trip:", error);
		return { success: false, error: "Database error occurred" };
	}
}

export async function getTrip(tripId: string): Promise<ActionResult<Trip>> {
	const user = await requireAuth();
	try {
		const tripData = await db.query.trip.findFirst({
			where: (trip, { eq, and }) =>
				and(eq(trip.id, tripId), eq(trip.userId, user.id)),
			with: {
				stops: {
					with: {
						activities: true,
					},
					orderBy: (stops, { asc }) => [asc(stops.orderIndex)],
				},
			},
		});
		if (!tripData) {
			return { success: false, error: "Trip not found" };
		}

		return { success: true, data: tripData };
	} catch (error) {
		console.error("Error fetching trip:", error);
		return { success: false, error: "Failed to fetch trip" };
	}
}

export async function getUserTrips(): Promise<ActionResult<Trip[]>> {
	const user = await requireAuth();
	try {
		const trips = await db.query.trip.findMany({
			where: (trip, { eq }) => eq(trip.userId, user.id),
			orderBy: (trip, { desc }) => desc(trip.startDate),
			with: {
				stops: {
					orderBy: (stops, { asc }) => [asc(stops.orderIndex)],
				},
			},
		});

		if (!trips) {
			return { success: false, error: "No trips founds" };
		}

		return { success: true, data: trips };
	} catch (error) {
		console.error("Failed to fetch trips:", error);
		return { success: false, error: "Failed to fetch trips" };
	}
}

export async function updateTrip(
	tripId: string,
	data: Partial<Omit<NewTrip, "userId">>
): Promise<ActionResult<Trip>> {
	const user = await requireAuth();
	try {
		const existingTrip = await db.query.trip.findFirst({
			where: (trip, { eq, and }) =>
				and(eq(trip.id, tripId), eq(trip.userId, user.id)),
		});

		if (!existingTrip) {
			return { success: false, error: "Trip not found" };
		}

		const [updatedTrip] = await db
			.update(trip)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(trip.id, tripId))
			.returning();

		if (!updatedTrip) {
			return { success: false, error: "Failed to update trip" };
		}

		revalidatePath("/trips");
		revalidatePath(`/trips/${tripId}`);
		return { success: true, data: updatedTrip };
	} catch (error) {
		console.error("Failed to update trip:", error);
		return { success: false, error: "Failed to update trip" };
	}
}

export async function deleteTrip(tripId: string): Promise<ActionResult<void>> {
	const user = await requireAuth();
	try {
		const existingTrip = await db.query.trip.findFirst({
			where: (trip, { eq, and }) =>
				and(eq(trip.id, tripId), eq(trip.userId, user.id)),
		});

		if (!existingTrip) {
			return { success: false, error: "Trip not found" };
		}

		await db.delete(trip).where(eq(trip.id, tripId));

		revalidatePath("/trips");
		return { success: true, data: undefined };
	} catch (error) {
		console.error("Failed to delete trip: ", error);
		return { success: false, error: "Failed to delete trip" };
	}
}

/* Trip Stop Queries */

export async function addNewStop(data: NewStop): Promise<ActionResult<Stop>> {
	try {
		const [newStop] = await db
			.insert(stop)
			.values({ ...data })
			.returning();

		if (!newStop) {
			return { success: false, error: "Failed to add stop" };
		}
		revalidatePath("/trips/[id]/");
		return { success: true, data: newStop };
	} catch (error) {
		console.error("Error adding stop: ", error);
		return { success: false, error: "Error adding stop" };
	}
}

export async function deleteStop(
	tripId: string,
	stopId: string
): Promise<ActionResult<void>> {
	try {
		const existingStop = await db.query.stop.findFirst({
			where: (stop, { eq, and }) =>
				and(eq(stop.id, stopId), eq(stop.tripId, tripId)),
		});

		if (!existingStop) {
			return { success: false, error: "Stop not found" };
		}
		await db.delete(stop).where(eq(stop.id, stopId));

		revalidatePath("/trips/[id]");
		return { success: true, data: undefined };
	} catch (error) {
		console.error("Failed to delete stop: ", error);
		return { success: false, error: "Failed to delete stop" };
	}
}

export async function updateStop(
	stopId: string,
	tripId: string,
	data: Partial<Omit<NewStop, "tripId" | "id">>
): Promise<ActionResult<Stop>> {
	try {
		const existingStop = await db.query.stop.findFirst({
			where: (stop, { eq, and }) =>
				and(eq(stop.id, stopId), eq(stop.tripId, tripId)),
		});

		if (!existingStop) {
			return { success: false, error: "Stop not found" };
		}

		const [updatedStop] = await db
			.update(stop)
			.set({ ...data, updatedAt: new Date() })
			.where(and(eq(stop.id, stopId), eq(stop.tripId, tripId)))
			.returning();

		if (!updatedStop) {
			return { success: false, error: "Could not update stop" };
		}
		return { success: true, data: updatedStop };
	} catch (error) {
		console.error("Failed to update stop: ", error);
		return { success: false, error: "Failed to update stop" };
	}
}
