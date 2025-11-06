import { relations } from "drizzle-orm";
import {
	boolean,
	date,
	integer,
	pgTable,
	text,
	time,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const trip = pgTable("trip", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stop = pgTable("stop", {
	id: text("id").primaryKey(),
	trip_id: text("id"),
	name: varchar("name", { length: 255 }).notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	orderIndex: integer("order_index").notNull(),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const activity = pgTable("activity", {
	id: text("id").primaryKey(),
	stopId: text("stop_id")
		.notNull()
		.references(() => stop.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	scheduledDate: date("scheduled_date"),
	scheduledTime: time("scheduled_time"),
	durationMinutes: integer("duration_minutes"),
	notes: text("notes"),
	isCompleted: boolean("is_completed").default(false).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/* Relations */

export const userRelation = relations(user, ({ many }) => ({
	trips: many(trip),
}));

export const tripRelation = relations(trip, ({ one, many }) => ({
	user: one(user, {
		fields: [trip.userId],
		references: [user.id],
	}),
	stops: many(stop),
}));

export const stopRelation = relations(stop, ({ one, many }) => ({
	trip: one(trip, {
		fields: [stop.trip_id],
		references: [trip.id],
	}),
	activities: many(activity),
}));

export const activityRelation = relations(activity, ({ one }) => ({
	stop: one(stop, {
		fields: [activity.stopId],
		references: [stop.id],
	}),
}));

/* Type exports */

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Trip = typeof trip.$inferSelect;
export type NewTrip = typeof trip.$inferInsert;

export type Stop = typeof stop.$inferSelect;
export type NewStop = typeof stop.$inferInsert;

export type Activity = typeof activity.$inferSelect;
export type NewActivity = typeof activity.$inferInsert;
