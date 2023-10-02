import { safeParse, enumType, number, object, coerce, minValue, optional } from 'valibot';
import { DEFAULT_DB_PROVIDER } from '$env/static/private';
const getGameResultsRequestSchema = object({
	offset: optional(coerce(number([integer(), minValue(0)]), Number), 0),
	count: optional(coerce(number([integer(), minValue(0)]), Number), 0),
	dbProvider: optional(enumType(['d1', DEFAULT_DB_PROVIDER]), DEFAULT_DB_PROVIDER)
});

import { error, json } from '@sveltejs/kit';
import { getGameResults } from '$lib/util/gameresults';
import { integer } from '$lib/types/gameresult';
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
	const gameResults = await getGameResults(
		session.user.login,
		data.count,
		data.dbProvider,
		data.offset
	);
	return json({
		...gameResults
	});
}
