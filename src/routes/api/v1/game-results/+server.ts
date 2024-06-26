import * as v from 'valibot';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';
import { error, json } from '@sveltejs/kit';

const EventToObjectSchema = v.pipe(
	v.object({
		url: v.instance(URL)
	}),
	v.transform((input) => {
		return v.parse(
			v.object({
				page: v.optional(
					v.pipe(
						v.pipe(
							v.unknown(),
							v.transform((input) => Number(input))
						),
						v.integer(),
						v.minValue(1)
					),
					'1'
				),
				user: v.pipe(
					v.pipe(
						v.unknown(),
						v.transform((input) => String(input))
					),
					v.minLength(1)
				)
			}),
			Object.fromEntries(input.url.searchParams.entries())
		);
	})
);

export async function GET(event) {
	const requestParseResult = v.safeParse(EventToObjectSchema, event);
	if (!requestParseResult.success) {
		error(400, 'Bad request');
	}
	const { user, page } = requestParseResult.output;
	const { getGames } = createApiWordlettuceClient(event);
	const gameResults = await getGames({ user, count: 30, offset: (page - 1) * 30 });
	return json({
		more: gameResults.more,
		results: gameResults.results,
		page
	});
}
