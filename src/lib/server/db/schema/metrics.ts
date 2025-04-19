import {
	bigint,
	boolean,
	decimal,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid
} from 'drizzle-orm/pg-core';
import { Device } from './device';

export const Metrics = pgTable(
	'metrics',
	{
		time: timestamp({ withTimezone: true, precision: 3 }).primaryKey().notNull(), // timescaledb support
		id: uuid(),
		name: text().notNull(),
		deviceId: uuid().references(() => Device.id),
		tagList: jsonb().$type<Tag[]>().default([]),
		fieldList: jsonb().$type<Field[]>().default([])
	},
	(table) => [
		index('id_device_id_name_time_idx').on(table.id, table.deviceId, table.name, table.time)
	]
);

interface Tag {
	name: string;
	value: string;
}

interface Field {
	name: string;
	value: string;
}

const metricsValueBase = {
	id: uuid().primaryKey().notNull(),
	metricsId: uuid().references(() => Metrics.id)
};

export const IntValue = pgTable('int_value', {
	...metricsValueBase,
	value: integer()
});

export const Long = pgTable('long_value', {
	...metricsValueBase,
	value: bigint({ mode: 'number' })
});

export const DecimalValue = pgTable('decimal_value', {
	...metricsValueBase,
	value: decimal()
});

export const BoolValue = pgTable('bool_value', {
	...metricsValueBase,
	value: boolean()
});

export const TextValue = pgTable('text_value', {
	...metricsValueBase,
	value: text()
});
