ALTER TABLE "action" ALTER COLUMN "key" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "required" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "type" varchar(8) NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "defaultValue" varchar(64);--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "minValue" numeric;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "maxValue" numeric;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "minLength" integer;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "maxLength" integer;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "enumList" varchar(16)[];--> statement-breakpoint
ALTER TABLE "command" ADD COLUMN "description" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "action" DROP COLUMN "value";