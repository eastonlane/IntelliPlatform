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

export const textName = {
	name: text().notNull()
};

export const userIsolation = {
	id: uuid().references(() => user.id)
};

export const basicInfoEntityBase = {
	...uuidPrimaryKey,
	...textName,
	...userIsolation
};
