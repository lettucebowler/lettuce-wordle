import {
	safeParse,
	enumType,
	number,
	useDefault,
	object,
	coerce,
	minValue
} from 'valibot';
import { DEFAULT_DB_PROVIDER } from '$env/static/private';
const getGameResultsRequestSchema = object({
	offset: useDefault(coerce(number([integer(), minValue(0)]), Number), 0),
	count: useDefault(coerce(number([integer(), minValue(0)]), Number), 0),
	dbProvider: useDefault(enumType(['planetscale', 'd1']), DEFAULT_DB_PROVIDER)
});

import { error, json } from '@sveltejs/kit';
import { getGameResults } from '$lib/util/gameresults';
import type { RequestEvent } from './$types';
import { integer } from '$lib/types/gameresult';
export async function GET(event: RequestEvent) {
	const result = safeParse(
		getGameResultsRequestSchema,
		Object.fromEntries(event.url.searchParams.entries())
	);
	if (!result.success) {
		throw error(400, result.error);
	}
	const { data } = result;
	const gameResults = await getGameResults(
		event.params.user,
		data.count,
		data.dbProvider,
		data.offset
	);
	return json({
		...gameResults
	});
}
