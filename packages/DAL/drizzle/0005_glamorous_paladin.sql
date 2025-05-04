CREATE TABLE "action" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"userId" uuid,
	"key" varchar(16),
	"value" varchar(16),
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "alert_rule" ALTER COLUMN "name" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "command" ALTER COLUMN "name" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "device" ALTER COLUMN "name" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "device_group" ALTER COLUMN "name" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "notification_webhook" ALTER COLUMN "name" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "command" ADD COLUMN "actions" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;