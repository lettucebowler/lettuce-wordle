import type { RequestEvent } from '@sveltejs/kit';
import { drizzle } from 'drizzle-orm/libsql';
import { gameResults, users } from '$lib/schemas/drizzle';
import { and, count, desc, eq, gt, lte, sql } from 'drizzle-orm';
import { getGameNum } from '$lib/util/words';
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private';

export function createWordlettuceBetaDao() {
	const db = drizzle({
		connection: {
			url: TURSO_DATABASE_URL,
			authToken: TURSO_AUTH_TOKEN
		}
	});

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
				gameNum,
				userId,
				answers,
				attempts
			})
			.onConflictDoUpdate({
				target: [gameResults.userId, gameResults.gameNum],
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
			.innerJoin(gameResults, eq(users.id, gameResults.userId))
			.where(and(gt(gameResults.gameNum, gameNum - 7), lte(gameResults.gameNum, gameNum)))
			.groupBy(users.id)
			.orderBy(desc(sql`score`))
			.limit(10);
		return query.all();
	}

	async function getGames({
		username,
		limit,
		offset
	}: {
		username: string;
		limit: number;
		offset: number;
	}) {
		const query = db
			.select({
				gameNum: gameResults.gameNum,
				answers: gameResults.answers,
				userId: gameResults.userId,
				attempts: gameResults.attempts
			})
			.from(users)
			.innerJoin(gameResults, eq(users.id, gameResults.userId))
			.where(eq(users.username, username))
			.orderBy(desc(gameResults.gameNum))
			.limit(limit + 1)
			.offset(offset);
		return query.all();
	}

	async function upsertUser({ userId, username }: { userId: number; username: string }) {
		return db
			.insert(users)
			.values({ username: username, id: userId })
			.onConflictDoUpdate({ target: users.id, set: { username } })
			.returning();
	}

	return {
		saveGame,
		getRankings,
		getGames,
		upsertUser
	};
}
