CREATE INDEX "stop_id_idx" ON "activity" USING btree ("stop_id");--> statement-breakpoint
CREATE INDEX "trip_id_idx" ON "stop" USING btree ("trip_id");