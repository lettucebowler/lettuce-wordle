import { z } from 'zod';
import { DEFAULT_DB_PROVIDER } from '$env/static/private';
const getGameResultsRequestSchema = z.object({
	offset: z.coerce
		.number({ invalid_type_error: 'offset must be an integer' })
		.int('offset must be an integer')
		.default(0),
	count: z.coerce
		.number({ invalid_type_error: 'count must be an integer' })
		.int('count must be an integer')
		.default(30),
	dbProvider: z.enum(['planetscale', 'd1']).default(DEFAULT_DB_PROVIDER as 'planetscale' | 'd1')
});

import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { getGameResults } from '$lib/util/gameresults';
export const GET: RequestHandler = async (event) => {
	const result = getGameResultsRequestSchema.safeParse(
		Object.fromEntries(event.url.searchParams.entries())
	);

	let dbProvider: string | null | undefined = event.url.searchParams.get('dbProvider');
	dbProvider =
		['d1', 'planetscale'].includes(`${dbProvider}`) && dbProvider != null ? dbProvider : undefined;

	if (!result.success) {
		throw error(400, result.error);
	}

	const { data } = result;

	const gameResults = await getGameResults(event.params.user, data.count, dbProvider, data.offset);
	return json({
		...gameResults
	});
};
