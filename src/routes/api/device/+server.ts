import type { PaginationDto } from '$lib/model/Pagination';
import { db } from '$lib/server/db';
import { device, type DeviceDO } from '$lib/server/db/schema/device';
import { json, type RequestHandler } from '@sveltejs/kit';
import { count } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const GET: RequestHandler = async ({ params }) => {
	const paging: PaginationDto<DeviceDO> = {
		page: 0,
		pageSize: 0,
		pageCount: 0,
		total: 0,
		items: []
	};
	const countResult = await db.select({ count: count() }).from(device);
	paging.total = countResult[0].count;
	paging.page = parseInt(params['pageNumber'] ?? '1');
	paging.pageSize = parseInt(params['pageSize'] ?? '10');
	paging.pageCount = Math.floor(paging.total / paging.pageSize + 1);
	paging.total = countResult[0].count;
	paging.items = await db
		.select()
		.from(device)
		.limit(paging.pageSize)
		.offset(paging.page - 1);
	return json(paging);
};

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	await db.insert(device).values({ name: name, id: uuidv4() });

	return json({ ok: true });
};
