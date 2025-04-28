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
import { device } from './device';

// SELECT create_hypertable('metrics', by_range('time'));
export const metrics = pgTable(
	'metrics',
	{
		time: timestamp({ withTimezone: true, precision: 3 }).notNull(), // timescaledb support
		name: text().notNull(),
		valueNumber: numeric(),
		valueBool: boolean(),
		deviceId: uuid().references(() => device.id),
		tagList: jsonb().$type<Tag[]>().default([]),
		fieldList: jsonb().$type<Field[]>().default([])
	},
	(table) => [index('id_device_id_name_time_idx').on(table.deviceId, table.name, table.time)]
);

export interface Tag {
	name: string;
	value: string;
}

export interface Field {
	name: string;
	value: string;
}

export type MetricsDO = typeof metrics.$inferSelect;
