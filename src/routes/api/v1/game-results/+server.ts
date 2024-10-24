import * as v from 'valibot';
import { error, json } from '@sveltejs/kit';
import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server.js';
import { getGameNum } from '$lib/util/words.js';

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
	const limit = 30;
	const { getNextPageAfter } = createWordlettuceBetaDao();
	const results = await getNextPageAfter({ username: user, limit, start });

	// event.setHeaders({
	// 	'Cache-Control': 'max-age=300'
	// });
	const last = results.at(-1);
	const next = results.length > limit ? (last ? last.gameNum : getGameNum()) : null;
	return json({
		results: results.slice(0, limit),
		start,
		next
	});
}
