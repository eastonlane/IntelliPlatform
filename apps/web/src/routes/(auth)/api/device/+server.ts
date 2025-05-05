import type { SearchPaginationDto } from '$lib/model/Pagination';
import { device, type DeviceDO } from '@dal/schema/device';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { count, ilike, inArray, isNull } from 'drizzle-orm';
import { v4 as uuidv4, validate } from 'uuid';
import { env } from '$env/dynamic/private';
import DbLoader from '@dal';
import { ensureAuthenticated } from '$lib/helper/authHelper';

const dbLoader = new DbLoader(env.VITE_DATABASE_URL);

export const GET: RequestHandler = async ({ url, locals }) => {
	ensureAuthenticated(locals);
	const params = url.searchParams;
	const paging: SearchPaginationDto<DeviceDO> = {
		searchTerm: null,
		page: 0,
		pageSize: 0,
		pageCount: 0,
		total: 0,
		items: []
	};
	paging.page = parseInt(params.get('page') ?? '1');
	paging.pageSize = parseInt(params.get('pageSize') ?? '10');
	paging.pageCount = Math.floor(paging.total / paging.pageSize + 1);
	paging.searchTerm = params.get('searchTerm') ?? null;

	const filters = [isNull(device.deleted_at), eq(device.userId, locals.user.id)];
	if (paging.searchTerm) {
		filters.push(ilike(device.name, `%${paging.searchTerm}%`));
	}

	paging.items = await dbLoader
		.getDb()
		.select()
		.from(device)
		.where(and(...filters))
		.limit(paging.pageSize)
		.offset(paging.page - 1);

	const countResult = await dbLoader
		.getDb()
		.select({ count: count() })
		.from(device)
		.where(and(...filters));
	paging.total = countResult[0].count;
	return json(paging);
};

export const POST: RequestHandler = async ({ request, locals }) => {
	ensureAuthenticated(locals);
	const { name } = await request.json();

	const result = await dbLoader
		.getDb()
		.insert(device)
		.values({ name: name, id: uuidv4(), userId: locals.user.id });

	return json({ ok: !!result.length });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	ensureAuthenticated(locals);
	const deviceIdList: string[] = await request.json();
	if (!deviceIdList || deviceIdList.length === 0) {
		return error(400, 'no device id');
	}

	if (deviceIdList.filter((idStr) => !validate(idStr)).length > 0) {
		return error(400, 'device id not valid');
	}

	const result = await dbLoader
		.getDb()
		.update(device)
		.set({ deleted_at: new Date() })
		.where(and(inArray(device.id, deviceIdList), eq(device.userId, locals.user.id)));

	return json({ ok: !!result.length });
};
