import * as m from '$lib/paraglide/messages';
import { error, fail } from '@sveltejs/kit';
export function validateUsername(
	identifier: string,
	username: unknown
): asserts username is string {
	if (typeof username !== 'string') {
		throwValidationFailError(identifier, m['validation.details.invalidInput']());
	}

	if (username.length < 3 || username.length > 31) {
		throwValidationFailError(identifier, m['validation.details.wrongLength']({ min: 3, max: 31 }));
	}
}

export function validatePassword(
	identifier: string,
	password: unknown
): asserts password is string {
	if (typeof password !== 'string') {
		throwValidationFailError(identifier, m['validation.details.invalidInput']());
	}

	if (password.length < 6 && password.length > 255) {
		throwValidationFailError(identifier, m['validation.details.wrongLength']({ min: 6, max: 255 }));
	}
}

export function validateEmail(identifier: string, email: unknown): asserts email is string {
	if (typeof email !== 'string') {
		throwValidationFailError(identifier, m['validation.details.invalidInput']());
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		throwValidationFailError(identifier, m['validation.details.notEmail']());
	}
}

function throwValidationFailError(identifier: string, details: string): never {
	error(400, { message: m['validation.baseMessage']({ identifier, details }) });
}
