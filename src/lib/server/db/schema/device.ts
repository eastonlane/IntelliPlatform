import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';

export const Device = pgTable('device', {
	...basicInfoEntityBase,
	groupId: uuid().references(() => DeviceGroup.id),

	...timestamps
});

export const DeviceGroup = pgTable('device_group', {
	...basicInfoEntityBase,

	...timestamps
});
