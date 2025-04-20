import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { User } from './user';

export const session = pgTable('device', {
	id: text('id').primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => User.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;