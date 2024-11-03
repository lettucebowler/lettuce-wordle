import * as v from 'valibot';
import { error, json } from '@sveltejs/kit';
import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server.js';
import { getGameNum } from '$lib/util/words.js';
// import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';

const EventToObjectSchema = v.pipe(
	v.object({
		url: v.instance(URL)
	}),
	v.transform((input) => {
		return v.parse(
			v.object({
				start: v.optional(
					v.pipe(
						v.pipe(
							v.unknown(),
							v.transform((input) => Number(input))
						),
						v.integer(),
						v.minValue(1)
					),
					getGameNum().toString()
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
	const { user, start } = requestParseResult.output;
	const db = createWordlettuceBetaDao(event);
	const { results, next, limit } = await db.getNextPageAfter({
		username: user,
		start
	});
	// const api = createApiWordlettuceClient(event);
	// const { results, next, limit } = await api.getNextPageAfter({ username: user, start });

	// event.setHeaders({
	// 	'Cache-Control': 'public,max-age=300'
	// });
	return json({
		results: results.slice(0, limit),
		start,
		next,
		limit
	});
}
