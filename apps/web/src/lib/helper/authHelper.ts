import { error } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages';

export function ensureAuthenticated(locals: App.Locals): asserts locals is App.Locals & {
	user: NonNullable<typeof locals.user>;
} {
	if (!locals.user) {
		throw error(401, new Error(m['server.unauthenticated']()));
	}
}
