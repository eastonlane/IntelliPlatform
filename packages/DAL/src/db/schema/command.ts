import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { basicInfoEntityBase, timestamps } from "../columns.helpers";
import { userTable } from "./user";
import { jsonb } from "drizzle-orm/pg-core";

export const DeviceAction = pgTable("action", {
  ...basicInfoEntityBase,

  userId: uuid().references(() => userTable.id),
  key: varchar({ length: 16 }),
  value: varchar({ length: 16 }),

  ...timestamps,
});
export type DeviceActionDO = typeof DeviceAction.$inferInsert;
export type DeviceActionVO = typeof DeviceAction.$inferSelect;

export const DeviceCommand = pgTable("command", {
  ...basicInfoEntityBase,

  userId: uuid().references(() => userTable.id),
  actions: jsonb().notNull().$type(),

  ...timestamps,
});
export type DeviceCommandDO = typeof DeviceCommand.$inferInsert;
export type DeviceCommandVO = typeof DeviceCommand.$inferSelect;
