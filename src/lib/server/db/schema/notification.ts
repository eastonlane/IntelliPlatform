import { pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';
import { User } from './user';

export const NotificationType = pgEnum('notification_type', ['webhook']);

export const WebhookNotification = pgTable('notification_webhook', {
	...basicInfoEntityBase,

	userId: uuid().references(() => User.id),
	webhookUrl: text().notNull(),

	...timestamps
});
