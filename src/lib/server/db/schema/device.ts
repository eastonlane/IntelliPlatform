import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';
import { User } from './user';

export const Device = pgTable('device', {
	...basicInfoEntityBase,

	groupId: uuid().references(() => DeviceGroup.id),
	userId: uuid().references(() => User.id),

	...timestamps
});

export const DeviceGroup = pgTable('device_group', {
	...basicInfoEntityBase,

	userId: uuid().references(() => User.id),

	...timestamps
});
