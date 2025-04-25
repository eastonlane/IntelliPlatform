CREATE TABLE "command" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "device" ADD COLUMN "lastOnline" timestamp;--> statement-breakpoint
ALTER TABLE "command" ADD CONSTRAINT "command_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;