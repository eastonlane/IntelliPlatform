import { error, json, type RequestHandler } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages';
import DbLoader from '@dal';
import { env } from '$env/dynamic/private';
import { metrics } from '@dal/schema/metrics';
import { and, gt, inArray, lt } from 'drizzle-orm';
import { ensureAuthenticated } from '$lib/helper/authHelper';

const dbLoader = new DbLoader(env.VITE_DATABASE_URL);

export const GET: RequestHandler = async ({ url, locals }) => {
	ensureAuthenticated(locals);
	const searchParam = url.searchParams;

	const [rangeBegin, rangeEnd, deviceIdList] = [
		searchParam.get('rangeBegin') as string,
		searchParam.get('rangeEnd') as string,
		searchParam.getAll('deviceId') as string[]
	];

	if (!rangeBegin || !rangeEnd || !deviceIdList) {
		error(400, m['data.wrongParamters']());
	}

	if (!deviceIdList.length) {
		error(400, m['data.emptyDeviceListIsProvided']());
	}

	const metricsList = await dbLoader
		.getDb()
		.select()
		.from(metrics)
		.where(
			and(
				gt(metrics.time, new Date(rangeBegin)),
				lt(metrics.time, new Date(rangeEnd)),
				inArray(metrics.deviceId, deviceIdList)
			)
		);

	return json({ ok: true, metricsList });
};
