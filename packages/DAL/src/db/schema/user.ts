import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';

export const userTable = pgTable('user', {
	id: uuid().primaryKey(),
	name: text().notNull(),

	...timestamps
});

export type User = typeof userTable.$inferSelect;