import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './schema';

// columns.helpers.ts
export const timestamps = {
	updated_at: timestamp(),
	created_at: timestamp().defaultNow().notNull(),
	deleted_at: timestamp()
};

export const uuidPrimaryKey = {
	id: uuid().primaryKey().notNull()
};

export const userIsolation = {
	userId: uuid().references(() => user.id)
};

export const basicInfoEntityBase = {
	...uuidPrimaryKey,
	name: text().notNull(),
	...userIsolation
};
