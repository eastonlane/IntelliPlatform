import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// columns.helpers.ts
export const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp(),
};

export const uuidPrimaryKey = {
  id: uuid().primaryKey().notNull(),
};

export const basicInfoEntityBase = {
  ...uuidPrimaryKey,
  name: varchar({ length: 64 }).notNull(),
};
