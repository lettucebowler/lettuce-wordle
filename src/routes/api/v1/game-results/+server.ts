import * as v from 'valibot';
import { error, json } from '@sveltejs/kit';
import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';

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
	const limit = 30;
	const offset = (page - 1) * 30;
	const { getGames } = createWordlettuceBetaDao(event);
	const results = await getGames({ username: user, limit, offset });

	return json({
		more: results.length > 30,
		results: results.slice(0, limit),
		page
	});
}
