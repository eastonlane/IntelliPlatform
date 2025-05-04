import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { basicInfoEntityBase, timestamps } from "../columns.helpers";
import { userTable } from "./user";
import { jsonb } from "drizzle-orm/pg-core";

export const Action = pgTable("action", {
  ...basicInfoEntityBase,

  userId: uuid().references(() => userTable.id),
  key: varchar({ length: 16 }),
  value: varchar({ length: 16 }),

  ...timestamps,
});
export type ActionDO = typeof Action.$inferInsert;
export type ActionVO = typeof Action.$inferSelect;

export const Command = pgTable("command", {
  ...basicInfoEntityBase,

  userId: uuid().references(() => userTable.id),
  actions: jsonb().notNull().$type(),

  ...timestamps,
});
export type CommandDO = typeof Command.$inferInsert;
export type CommandVO = typeof Command.$inferSelect;
