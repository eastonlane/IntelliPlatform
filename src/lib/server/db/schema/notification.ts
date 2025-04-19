import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';

export const NotificationType = pgEnum('notification_type', ['webhook']);

export const WebhookNotification = pgTable('notification_webhook', {
	...basicInfoEntityBase,

	webhookUrl: text().notNull(),

	...timestamps
});
