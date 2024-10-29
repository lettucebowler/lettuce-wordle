import { drizzle } from 'drizzle-orm/d1';
import { gameResults, users } from '$lib/schemas/drizzle';
import { and, count, desc, eq, gt, lte, sql } from 'drizzle-orm';
import { getGameNum } from '$lib/util/words';
// import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';

export function createWordlettuceBetaDao(event: RequestEvent) {
	const db = drizzle(event.platform?.env?.WORDLETTUCE_DB);

	async function saveGame({
		userId,
		gameNum,
		answers
	}: {
		userId: number;
		gameNum: number;
		answers: string;
	}) {
		const attempts = Math.floor(answers.length / 5);
		return db
			.insert(gameResults)
			.values({
				gamenum: gameNum,
				userId,
				answers,
				attempts
			})
			.onConflictDoUpdate({
				target: [gameResults.userId, gameResults.gamenum],
				set: { answers, attempts }
			})
			.returning();
	}

	async function getRankings() {
		const gameNum = getGameNum();
		const query = db
			.select({
				user: users.username,
				games: count(gameResults.attempts),
				score: sql`count(${gameResults.attempts}) + sum(max(0, 6 - ${gameResults.attempts}))`
					.mapWith(Number)
					.as('score')
			})
			.from(users)
			.innerJoin(gameResults, eq(users.githubId, gameResults.userId))
			.where(and(gt(gameResults.gamenum, gameNum - 7), lte(gameResults.gamenum, gameNum)))
			.groupBy(users.githubId)
			.orderBy(desc(sql`score`))
			.limit(10);
		return query.all();
	}

	async function getNextPageAfter({
		username,
		limit = 30,
		start = getGameNum()
	}: {
		username: string;
		limit?: number;
		start: number;
	}) {
		const query = db
			.select({
				gameNum: gameResults.gamenum,
				answers: gameResults.answers,
				userId: gameResults.userId,
				attempts: gameResults.attempts
			})
			.from(users)
			.innerJoin(gameResults, eq(users.githubId, gameResults.userId))
			.where(and(eq(users.username, username), lte(gameResults.gamenum, start)))
			.orderBy(desc(gameResults.gamenum))
			.limit(limit + 1);
		const results = await query.all();
		return {
			results: results.slice(0, limit),
			next: results.length > limit ? results.at(-1)?.gameNum : null,
			limit
		};
	}

	async function upsertUser({ userId, username }: { userId: number; username: string }) {
		return db
			.insert(users)
			.values({ username: username, githubId: userId })
			.onConflictDoUpdate({ target: users.githubId, set: { username } })
			.returning();
	}

	return {
		saveGame,
		getRankings,
		upsertUser,
		getNextPageAfter
	};
}
