import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';
import { userTable } from './user';

export const device = pgTable('device', {
	...basicInfoEntityBase,

	groupId: uuid().references(() => deviceGroup.id),
	userId: uuid().references(() => userTable.id),
	lastOnline: timestamp(),

	...timestamps
});

export const deviceGroup = pgTable('device_group', {
	...basicInfoEntityBase,

	userId: uuid().references(() => userTable.id),

	...timestamps
});

export type DeviceDO = typeof device.$inferSelect;
export type DeviceGroupDO = typeof deviceGroup.$inferSelect;
