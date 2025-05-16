import { boolean, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { basicInfoEntityBase, timestamps } from "../columns.helpers";
import { userTable } from "./user";
import { jsonb } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { numeric } from "drizzle-orm/pg-core";
import { check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const DeviceAction = pgTable(
  "action",
  {
    ...basicInfoEntityBase,

    description: text().notNull().default(""),

    userId: uuid().references(() => userTable.id),
    key: varchar({ length: 16 }).notNull(),
    required: boolean().default(false),

    type: varchar({
      length: 8,
      enum: ["number", "boolean", "string", "enum"],
    }).notNull(),
    defaultValue: varchar({ length: 64 }),

    minValue: numeric(),
    maxValue: numeric(),

    minLength: integer(),
    maxLength: integer(),

    enumList: varchar({ length: 16 }).array(),

    ...timestamps,
  },
  (t) => [
    check(
      "stringLengthCheck",
      sql`NOT (${t.minLength} IS NOT NULL AND ${t.maxLength} IS NOT NULL and ${t.minLength} > ${t.maxLength})`
    ),
    check(
      "numberBoundaryCheck",
      sql`NOT (${t.minValue} IS NOT NULL AND ${t.maxValue} IS NOT NULL and ${t.minValue} > ${t.maxValue})`
    ),
  ]
);
export type DeviceActionDO = typeof DeviceAction.$inferInsert;
export type DeviceActionVO = typeof DeviceAction.$inferSelect;

export enum DeviceActionDataType {
  int = "int",
  float = "float",
  boolean = "boolean",
  string = "string",
  enum = "enum",
}

export const DeviceCommand = pgTable("command", {
  ...basicInfoEntityBase,

  userId: uuid().references(() => userTable.id),
  actions: jsonb().notNull().$type<DeviceActionDO[]>(),
  description: text().notNull().default(""),

  ...timestamps,
});
export type DeviceCommandDO = typeof DeviceCommand.$inferInsert;
export type DeviceCommandVO = typeof DeviceCommand.$inferSelect;

// export const DeviceCommandLog = pgTable("commandLog", {});
