CREATE TABLE "debits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goal_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"food_name" text NOT NULL,
	"notes" text,
	"debited_at" timestamp with time zone DEFAULT now(),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "debits_notes_check" CHECK ("debits"."notes" is null or char_length("debits"."notes") <= 250)
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"total_items" integer NOT NULL,
	"duration_value" integer NOT NULL,
	"duration_unit" text DEFAULT 'month' NOT NULL,
	"start_date" timestamp with time zone DEFAULT now() NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "goals_total_items_check" CHECK ("goals"."total_items" >= 1 and "goals"."total_items" <= 100),
	CONSTRAINT "goals_status_check" CHECK ("goals"."status" in ('active', 'completed', 'reviewing')),
	CONSTRAINT "goals_duration_unit_check" CHECK ("goals"."duration_unit" in ('week', 'month')),
	CONSTRAINT "goals_duration_value_check" CHECK (("goals"."duration_unit" = 'week' and "goals"."duration_value" between 1 and 52) or ("goals"."duration_unit" = 'month' and "goals"."duration_value" between 1 and 12))
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "debits" ADD CONSTRAINT "debits_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "debits" ADD CONSTRAINT "debits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "debits_goal_id_idx" ON "debits" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "debits_user_id_idx" ON "debits" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "goals_user_id_idx" ON "goals" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "goals_status_idx" ON "goals" USING btree ("status");