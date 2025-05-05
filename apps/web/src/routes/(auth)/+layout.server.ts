import handleLoginRedirect from '$lib/helper/loginHelper';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { localizeUrl } from '$lib/paraglide/runtime';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, localizeUrl(handleLoginRedirect(event)));
	}
};
