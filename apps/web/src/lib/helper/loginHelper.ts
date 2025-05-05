import type { RequestEvent } from '@sveltejs/kit';
import * as m from '$lib/paraglide/messages';

export default function handleLoginRedirect(
	event: RequestEvent,
	message: string = m.redirectToLoginDefaultMessage()
) {
	const redirectTo = event.url.pathname + event.url.search;
	return `/login?redirectTo=${redirectTo}&message=${message}`;
}
