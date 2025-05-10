import type { PageServerLoad } from './$types';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
	auth.deleteSessionTokenCookie(event);
};
