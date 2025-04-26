import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { basicInfoEntityBase, timestamps } from '../columns.helpers';
import { userTable } from './user';

export const Command = pgTable('command', {
	...basicInfoEntityBase,

    userId: uuid().references(() => userTable.id),

    ...timestamps,
});
