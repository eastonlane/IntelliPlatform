import DbLoader from '@dal';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { device } from '@dal/schema/device';
import { eq } from 'drizzle-orm';

const dbLoader = new DbLoader(env.VITE_DATABASE_URL);

export const load: PageServerLoad = async ({ locals }) => {
	const getDeviceList = dbLoader
		.getDb()
		.select()
		.from(device)
		.where(eq(device.userId, locals.user!.id));

	return {
		getDeviceList
	};
};
