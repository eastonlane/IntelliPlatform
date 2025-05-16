import { ensureAuthenticated } from '$lib/helper/authHelper';
import { DeviceAction, type DeviceActionDO } from '@dal/schema/command';
import type { RequestHandler } from './$types';
import { dbLoader } from '$lib/helper/dbHelper';
import { v4 as uuidv4 } from 'uuid';
import { error, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	ensureAuthenticated(locals);

	const action: DeviceActionDO = await request.json();

	const actionToInsert: DeviceActionDO = {
		id: uuidv4(),
		name: action.name,
		description: action.description,
		required: action.required,
		key: action.key,
		type: action.type,
		created_at: new Date(),
		userId: locals.user.id
	};

	switch (action.type) {
		case 'string':
			if (action.defaultValue !== null && typeof action.defaultValue !== action.type) {
				error(400, {
					message: `param 'defaultValue' type mismatched. Expected: ${action.type}, actual: ${typeof action.defaultValue}`
				});
			}
			actionToInsert.minLength = action.minLength;
			actionToInsert.maxLength = action.maxLength;
			break;
		case 'number':
			if (action.defaultValue !== null && typeof action.defaultValue !== action.type) {
				error(400, {
					message: `param 'defaultValue' type mismatched. Expected: ${action.type}, actual: ${typeof action.defaultValue}`
				});
			}
			actionToInsert.minValue = action.minValue;
			actionToInsert.maxValue = action.maxValue;
			break;
		case 'enum':
			if (action.defaultValue !== null && typeof action.defaultValue !== 'string') {
				error(400, {
					message: `param 'defaultValue' type mismatched. Expected: ${action.type}, actual: ${typeof action.defaultValue}`
				});
			}
			actionToInsert.enumList = action.enumList;
			break;
		case 'boolean':
			if (action.defaultValue !== null && typeof action.defaultValue !== action.type) {
				error(400, {
					message: `param 'defaultValue' type mismatched. Expected: ${action.type}, actual: ${typeof action.defaultValue}`
				});
			}
			break;
	}
	actionToInsert.defaultValue = action.defaultValue;

	const result = await dbLoader.getDb().insert(DeviceAction).values(actionToInsert);

	return json({ ok: true, result: result.count });
};
