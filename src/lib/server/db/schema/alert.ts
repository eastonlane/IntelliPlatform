import { pgTable } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';

export const Alert = pgTable('alert', {
	...timestamps
});

export const AlertRule = pgTable('alert_rule', {
	...basicInfoEntityBase,

	...timestamps
});
