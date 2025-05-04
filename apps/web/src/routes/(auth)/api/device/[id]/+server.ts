import { device, type DeviceDO } from '@dal/schema/device';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { validate as validateUUID } from 'uuid';
import { env } from '$env/dynamic/private';
import DbLoader from '@dal';

const dbLoader = new DbLoader(env.VITE_DATABASE_URL);

export const PUT: RequestHandler = async ({ params, request }) => {
	if (!validateUUID(params.id)) {
		return error(400, 'no invalid device id');
	}

	const deviceDto: DeviceDO = await request.json();

	await dbLoader.getDb().update(device).set({ name: deviceDto.name, updated_at: new Date() });

	return json({ ok: true });
};
