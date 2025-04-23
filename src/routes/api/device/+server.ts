import type { SearchPaginationDto } from '$lib/model/Pagination';
import { db } from '$lib/server/db';
import { device, type DeviceDO } from '$lib/server/db/schema/device';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { and } from 'drizzle-orm';
import { count, ilike, inArray, isNull } from 'drizzle-orm';
import { v4 as uuidv4, validate } from 'uuid';

export const GET: RequestHandler = async ({ params }) => {
	const paging: SearchPaginationDto<DeviceDO> = {
		searchTerm: null,
		page: 0,
		pageSize: 0,
		pageCount: 0,
		total: 0,
		items: []
	};
	paging.page = parseInt(params['pageNumber'] ?? '1');
	paging.pageSize = parseInt(params['pageSize'] ?? '10');
	paging.pageCount = Math.floor(paging.total / paging.pageSize + 1);
	paging.searchTerm = params['searchTerm'] ?? null;

	const filters = [isNull(device.deleted_at)];
	if (paging.searchTerm) {
		filters.push(ilike(device.name, `%${paging.searchTerm}%`));
	}

	console.log(filters.length);

	paging.items = await db
		.select()
		.from(device)
		.where(and(...filters))
		.limit(paging.pageSize)
		.offset(paging.page - 1);

	const countResult = await db
		.select({ count: count() })
		.from(device)
		.where(and(...filters));
	paging.total = countResult[0].count;
	return json(paging);
};

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	await db.insert(device).values({ name: name, id: uuidv4() });

	return json({ ok: true });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const deviceIdList: string[] = await request.json();
	if (!deviceIdList || deviceIdList.length === 0) {
		return error(400, 'no device id');
	}

	if (deviceIdList.filter((idStr) => !validate(idStr)).length > 0) {
		return error(400, 'device id not valid');
	}

	await db.update(device).set({ deleted_at: new Date() }).where(inArray(device.id, deviceIdList));

	return json({ ok: true });
};
