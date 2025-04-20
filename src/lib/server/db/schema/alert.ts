import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';
import { User } from './user';

export const Alert = pgTable('alert', {
	...timestamps
});

export const AlertRule = pgTable('alert_rule', {
	...basicInfoEntityBase,
	userId: uuid().references(() => User.id),

	...timestamps
});
