import { validatePassword, validateUsername } from '$lib/utils/userInputUtil';
import { userTable } from '@dal/schema/user';
import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import DbLoader from '@dal';
import { v4 as uuidv4, } from 'uuid';

const dbLoader = new DbLoader(process.env.VITE_DATABASE_URL!);

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password' });
		}

		const userId = generateUserId();
		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await dbLoader.getDb().insert(userTable).values({ id: userId, name: username, passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			return fail(500, { message: `An error has occurred: ${e}` });
		}
		return redirect(302, '/demo/lucia');
	}
};

function generateUserId() {
    return uuidv4().toString()
}
