import { validatePassword, validateUsername } from '$lib/utils/userInputUtil';
import { userTable } from '@dal/schema/user';
import { hash } from '@node-rs/argon2';
import { fail, redirect, isHttpError } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import * as m from '$lib/paraglide/messages';
import DbLoader from '@dal';
import { v4 as uuidv4 } from 'uuid';
import { localizeUrl } from '$lib/paraglide/runtime.js';
import { env } from '$env/dynamic/private';
import { count, eq } from 'drizzle-orm';

const dbLoader = new DbLoader(env.VITE_DATABASE_URL!);

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		try {
			validateUsername(m['action.register.invalidUserName'](), username);
			validatePassword(m['action.register.invalidPassword'](), password);

			// avoid duplicate
			const [{ count: existCount }] = await dbLoader
				.getDb()
				.select({ count: count() })
				.from(userTable)
				.where(eq(userTable.name, username));
			console.log(existCount);

			if (existCount) {
				return fail(400, { message: m['action.register.userExist']() });
			}

			const userId = generateUserId();
			const passwordHash = await hash(password, {
				// recommended minimum parameters
				memoryCost: 19456,
				timeCost: 2,
				outputLen: 32,
				parallelism: 1
			});

			await dbLoader.getDb().insert(userTable).values({ id: userId, name: username, passwordHash });

			// const sessionToken = auth.generateSessionToken();
			// const session = await auth.createSession(sessionToken, userId);
			// auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			if (e instanceof Error) {
				console.log(e.stack);
			}
			if (isHttpError(e)) {
				return fail(e.status, { message: e.body.message });
			}
			return fail(500, {
				message: m['action.register.finalCatchMessage']({
					err: e instanceof Error ? e.message : 'unknown'
				})
			});
		}
		return redirect(302, localizeUrl('/login'));
	}
};

function generateUserId() {
	return uuidv4().toString();
}
