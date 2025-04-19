CREATE TYPE "public"."notification_type" AS ENUM('webhook');--> statement-breakpoint
CREATE TABLE "alert" (
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "alert_rule" (
	"id" uuid,
	"name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "device" (
	"id" uuid,
	"name" text NOT NULL,
	"groupId" uuid,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "device_group" (
	"id" uuid,
	"name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bool_value" (
	"id" uuid PRIMARY KEY NOT NULL,
	"metricsId" uuid,
	"value" boolean
);
--> statement-breakpoint
CREATE TABLE "decimal_value" (
	"id" uuid PRIMARY KEY NOT NULL,
	"metricsId" uuid,
	"value" numeric
);
--> statement-breakpoint
CREATE TABLE "int_value" (
	"id" uuid PRIMARY KEY NOT NULL,
	"metricsId" uuid,
	"value" integer
);
--> statement-breakpoint
CREATE TABLE "long_value" (
	"id" uuid PRIMARY KEY NOT NULL,
	"metricsId" uuid,
	"value" bigint
);
--> statement-breakpoint
CREATE TABLE "metrics" (
	"time" timestamp (3) with time zone PRIMARY KEY NOT NULL,
	"id" uuid,
	"name" text NOT NULL,
	"deviceId" uuid,
	"tagList" jsonb DEFAULT '[]'::jsonb,
	"fieldList" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "text_value" (
	"id" uuid PRIMARY KEY NOT NULL,
	"metricsId" uuid,
	"value" text
);
--> statement-breakpoint
CREATE TABLE "notification_webhook" (
	"id" uuid,
	"name" text NOT NULL,
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
ALTER TABLE "alert_rule" ADD CONSTRAINT "alert_rule_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device" ADD CONSTRAINT "device_groupId_device_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."device_group"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_group" ADD CONSTRAINT "device_group_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bool_value" ADD CONSTRAINT "bool_value_metricsId_metrics_id_fk" FOREIGN KEY ("metricsId") REFERENCES "public"."metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decimal_value" ADD CONSTRAINT "decimal_value_metricsId_metrics_id_fk" FOREIGN KEY ("metricsId") REFERENCES "public"."metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "int_value" ADD CONSTRAINT "int_value_metricsId_metrics_id_fk" FOREIGN KEY ("metricsId") REFERENCES "public"."metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "long_value" ADD CONSTRAINT "long_value_metricsId_metrics_id_fk" FOREIGN KEY ("metricsId") REFERENCES "public"."metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics" ADD CONSTRAINT "metrics_deviceId_device_id_fk" FOREIGN KEY ("deviceId") REFERENCES "public"."device"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_value" ADD CONSTRAINT "text_value_metricsId_metrics_id_fk" FOREIGN KEY ("metricsId") REFERENCES "public"."metrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_webhook" ADD CONSTRAINT "notification_webhook_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "id_device_id_name_time_idx" ON "metrics" USING btree ("id","deviceId","name","time");