import { ensureAuthenticated } from '$lib/helper/authHelper';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	ensureAuthenticated(locals);
};
