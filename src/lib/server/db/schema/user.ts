import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../columns.helpers';

export const User = pgTable('user', {
	id: uuid().primaryKey(),
	name: text().notNull(),

	...timestamps
});
