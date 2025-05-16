export function isNotNullValue(value: unknown): boolean {
	if (typeof value === 'undefined') {
		return false;
	}

	if (typeof value === 'object') {
		return value !== null;
	}

	return true;
}

