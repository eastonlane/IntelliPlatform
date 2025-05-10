import DbLoader from '@dal';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { device } from '@dal/schema/device';
import { and, eq, gt, inArray, lt } from 'drizzle-orm';
import { fail, type Actions } from '@sveltejs/kit';
import { metrics } from '@dal/schema/metrics';
import * as m from '$lib/paraglide/messages';

const dbLoader = new DbLoader(env.VITE_DATABASE_URL);

export const load: PageServerLoad = async ({ locals }) => {
	const deviceList = await dbLoader
		.getDb()
		.select()
		.from(device)
		.where(eq(device.userId, locals.user!.id));

	return {
		deviceList
	};
};

export const actions: Actions = {
	getMetrics: async ({ request }) => {
		const searchParam = await request.formData();

		const [rangeBegin, rangeEnd, deviceIdList] = [
			searchParam.get('rangeBegin') as string,
			searchParam.get('rangeEnd') as string,
			searchParam.getAll('deviceId') as string[]
		];

		if (!rangeBegin || !rangeEnd || !deviceIdList) {
			return fail(400, { err: m['data.wrongParamters']() });
		}

		if (!deviceIdList.length) {
			return fail(400, { err: m['data.emptyDeviceListIsProvided']() });
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

		if (!metricsList?.length) {
			return fail(404, { err: m['data.noMetricsFound']() });
		}
		return { ok: true, metricsList };
	}
};
