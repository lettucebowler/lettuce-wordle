import { delay } from '../utils.js';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';
import { drizzle } from 'drizzle-orm/d1';
import { gameResults, users } from '$lib/schemas/drizzle';
import { and, count, desc, eq, gt, lte, sql } from 'drizzle-orm';
import { getGameNum } from '$lib/util/words.js';

export async function load(event) {
	const gameNum = getGameNum();
	const db = drizzle(event.platform?.env?.WORDLETTUCE_DB);
	const query = db
		.select({
			user: users.username,
			games: count(gameResults.attempts),
			score: sql`count(${gameResults.attempts}) + sum(max(0, 6 - ${gameResults.attempts}))`
				.mapWith(Number)
				.as('score')
		})
		.from(users)
		.innerJoin(gameResults, eq(users.id, gameResults.userId))
		.where(and(gt(gameResults.gameNum, gameNum - 7), lte(gameResults.gameNum, gameNum)))
		.groupBy(users.id)
		.orderBy(desc(sql`score`))
		.limit(10);

	const rankings = await query.all();

	return {
		rankings
	};
}
