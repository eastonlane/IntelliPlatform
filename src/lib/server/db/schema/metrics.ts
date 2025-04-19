import {
	boolean,
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
	numeric
} from 'drizzle-orm/pg-core';
import { Device } from './device';

// SELECT create_hypertable('metrics', by_range('time'));
export const Metrics = pgTable(
	'metrics',
	{
		time: timestamp({ withTimezone: true, precision: 3 }).primaryKey().notNull(), // timescaledb support
		name: text().notNull(),
		valueNumber: numeric(),
		valueBool: boolean(),
		deviceId: uuid().references(() => Device.id),
		tagList: jsonb().$type<Tag[]>().default([]),
		fieldList: jsonb().$type<Field[]>().default([])
	},
	(table) => [index('id_device_id_name_time_idx').on(table.deviceId, table.name, table.time)]
);

interface Tag {
	name: string;
	value: string;
}

interface Field {
	name: string;
	value: string;
}
