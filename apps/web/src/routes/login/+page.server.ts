import { verify } from '@node-rs/argon2';
import { fail, isHttpError, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import * as m from '$lib/paraglide/messages';
import type { Actions, PageServerLoad } from './$types';
import { userTable } from '@dal/schema/user';
import DbLoader from '@dal';
import { validatePassword, validateUsername } from '$lib/utils/userInputUtil';
import { localizeUrl } from '$lib/paraglide/runtime';

const dbLoader = new DbLoader(process.env.VITE_DATABASE_URL!);

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, localizeUrl('/'));
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();
			const username = formData.get('username');
			const password = formData.get('password');

			validateUsername(m['action.register.invalidUserName'](), username);
			validatePassword(m['action.register.invalidPassword'](), password);

			const results = await dbLoader
				.getDb()
				.select()
				.from(userTable)
				.where(eq(userTable.name, username));

			const existingUser = results.at(0);
			if (!existingUser) {
				return fail(400, { message: 'Incorrect username or password' });
			}

			const validPassword = await verify(existingUser.passwordHash, password, {
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});
			if (!validPassword) {
				return fail(400, { message: 'Incorrect username or password' });
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, existingUser.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			if (isHttpError(e)) {
				return fail(e.status, { message: e.body.message });
			}
			return fail(500, {
				message: m['action.register.finalCatchMessage']({
					err: e instanceof Error ? e.message : 'unknown'
				})
			});
		}
		return redirect(302, localizeUrl('/'));
	}
};
