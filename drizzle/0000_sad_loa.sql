CREATE TYPE "public"."notification_type" AS ENUM('webhook');--> statement-breakpoint
CREATE TABLE "alert" (
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "alert_rule" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "device" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" uuid,
	"groupId" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "device_group" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "metrics" (
	"time" timestamp (3) with time zone PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"valueNumber" numeric,
	"valueBool" boolean,
	"deviceId" uuid,
	"tagList" jsonb DEFAULT '[]'::jsonb,
	"fieldList" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "notification_webhook" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userId" uuid,
	"webhookUrl" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "alert_rule" ADD CONSTRAINT "alert_rule_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_groupId_device_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."device_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_group" ADD CONSTRAINT "device_group_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_deviceId_device_id_fk" FOREIGN KEY ("deviceId") REFERENCES "public"."device"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_webhook" ADD CONSTRAINT "notification_webhook_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "id_device_id_name_time_idx" ON "metrics" USING btree ("deviceId","name","time");