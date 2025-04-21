import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';
import { User } from './user';

export const alert = pgTable('alert', {
	...timestamps
});

export const alertRule = pgTable('alert_rule', {
	...basicInfoEntityBase,
	userId: uuid().references(() => User.id),

	...timestamps
});

export const AlertDO = typeof alert.$inferSelect;

export const AlertRuleDO = typeof alertRule.$inferSelect;
