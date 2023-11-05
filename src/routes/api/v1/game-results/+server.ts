import { safeParse, picklist, number, object, coerce, minValue, optional, integer } from 'valibot';
import { DEFAULT_DB_PROVIDER } from '$env/static/private';
const getGameResultsRequestSchema = object({
	offset: optional(coerce(number([integer(), minValue(0)]), Number), 0),
	count: optional(coerce(number([integer(), minValue(0)]), Number), 0),
	dbProvider: optional(picklist(['d1', DEFAULT_DB_PROVIDER]), DEFAULT_DB_PROVIDER)
});

import { error, json } from '@sveltejs/kit';
import { getGameResults, type Provider } from '$lib/util/gameresults';
export async function GET(event) {
	const session = await event.locals.getWordLettuceSession();
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	const result = safeParse(
		getGameResultsRequestSchema,
		Object.fromEntries(event.url.searchParams.entries())
	);
	if (!result.success) {
		throw error(400, result.error);
	}
	const data = result.output;
	const gameResults = await getGameResults({
		event,
		provider: (data.dbProvider as Provider) ?? (DEFAULT_DB_PROVIDER as Provider),
		data: {
			...data,
			user: session.user.login
		}
	});
	return json({
		...gameResults
	});
}
