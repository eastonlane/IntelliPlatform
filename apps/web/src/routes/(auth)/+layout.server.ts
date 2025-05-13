import handleLoginRedirect from '$lib/helper/loginHelper';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { localizeUrl } from '$lib/paraglide/runtime';
import { dbLoader } from '$lib/helper/dbHelper';
import { DeviceCommand } from '@dal/schema/command';
import { eq } from 'drizzle-orm';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, localizeUrl(handleLoginRedirect(event)));
	}

	const userId = event.locals.user.id;
	const getDeviceCommand = dbLoader
		.getDb()
		.select()
		.from(DeviceCommand)
		.where(eq(DeviceCommand.userId, userId));

	return {
		getDeviceCommand
	};
};
