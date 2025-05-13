import { dbLoader } from '$lib/helper/dbHelper';
import { device } from '@dal/schema/device';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from '../$types';
import { DeviceCommand } from '@dal/schema/command';

export const load: LayoutServerLoad = async ({ locals }) => {
	const userId = locals.user!.id;

	const getDeviceList = dbLoader.getDb().select().from(device).where(eq(device.userId, userId));

	const getDeviceCommand = dbLoader
		.getDb()
		.select()
		.from(DeviceCommand)
		.where(eq(DeviceCommand.userId, userId));

	return {
		getDeviceList,
		getDeviceCommand
	};
};
