import { db } from '$lib/server/db';
import { device, type DeviceDO } from '$lib/server/db/schema/device';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { validate as validateUUID } from 'uuid';

export const PUT: RequestHandler = async ({ route, request }) => {
	if (!validateUUID(route.id)) {
		return error(400, 'no invalid device id');
	}

	const deviceDto: DeviceDO = await request.json();

	db.update(device).set({ name: deviceDto.name, updated_at: new Date() });

	return json({ ok: true });
};
