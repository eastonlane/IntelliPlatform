import { device, type DeviceDO } from '@dal/schema/device';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { validate as validateUUID } from 'uuid';
import { env } from '$env/dynamic/private';
import DbLoader from '@dal';
import { ensureAuthenticated } from '$lib/helper/authHelper';
import { and, eq, isNull } from 'drizzle-orm';

const dbLoader = new DbLoader(env.VITE_DATABASE_URL);

export const PUT: RequestHandler = async ({ params, request, locals }) => {
	ensureAuthenticated(locals);
	if (!validateUUID(params.id)) {
		return error(400, 'no invalid device id');
	}

	const deviceDto: DeviceDO = await request.json();

	const res = await dbLoader
		.getDb()
		.update(device)
		.set({ name: deviceDto.name, updated_at: new Date() })
		.where(and(eq(device.userId, locals.user.id), isNull(device.deleted_at)));

	return json({ ok: !!res.length });
};
