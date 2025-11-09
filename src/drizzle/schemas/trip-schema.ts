import { relations, sql } from "drizzle-orm";
import {
	boolean,
	date,
	index,
	integer,
	pgTable,
	text,
	time,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const trip = pgTable("trip", {
	id: uuid("id")
		.primaryKey()
		.default(sql`gen_random_uuid()`),
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

export const stop = pgTable(
	"stop",
	{
		id: uuid("id")
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		tripId: uuid("trip_id").references(() => trip.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 255 }).notNull(),
		startDate: date("start_date"),
		endDate: date("end_date"),
		orderIndex: integer("order_index").notNull(),
		notes: text("notes"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [index("trip_id_idx").on(table.tripId)]
);

export const activity = pgTable(
	"activity",
	{
		id: uuid("id")
			.primaryKey()
			.default(sql`gen_random_uuid()`),
		stopId: uuid("stop_id")
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
	},
	(table) => [index("stop_id_idx").on(table.stopId)]
);

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
		fields: [stop.tripId],
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
