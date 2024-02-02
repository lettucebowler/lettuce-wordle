import { safeParse, number, object, coerce, minValue, optional, integer, string } from 'valibot';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';
const getGameResultsRequestSchema = object({
	offset: optional(coerce(number([integer(), minValue(0)]), Number), 0),
	count: optional(coerce(number([integer(), minValue(0)]), Number), 0),
	user: string()
});

import { error, json } from '@sveltejs/kit';
export async function GET(event) {
	const requestParseResult = safeParse(
		getGameResultsRequestSchema,
		Object.fromEntries(event.url.searchParams.entries())
	);
	if (!requestParseResult.success) {
		error(400, 'Bad request');
	}
	const { user, count, offset } = requestParseResult.output;
	const { getGames } = createApiWordlettuceClient(event);
	const gameResults = await getGames({ user, count, offset });
	return json(gameResults);
}
