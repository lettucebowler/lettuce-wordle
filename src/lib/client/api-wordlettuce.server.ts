import { type StatusError, fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_HOST, API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import { array, boolean, integer, number, object, required, safeParse, string } from 'valibot';
import { gameResultSchema, leaderboardResultSchema } from '$lib/types/gameresult';

export function createApiWordLettuceFetcher(event: RequestEvent) {
	return fetcher({
		fetch: event.fetch,
		base: API_WORDLETTUCE_HOST,
		headers: {
			Authorization: `Bearer ${API_WORDLETTUCE_TOKEN}`
		}
	});
}

type Result<T extends unknown> =
	| {
			status: 'SUCCESS';
			data: T;
	  }
	| {
			status: 'ERROR';
			error: StatusError;
	  };
async function toResult<T extends unknown>(promise: Promise<T>): Promise<Result<T>> {
	return promise
		.then((data) => ({ status: 'SUCCESS' as 'SUCCESS', data }))
		.catch((error) => ({ status: 'ERROR' as 'ERROR', error }));
}

const getRankinsResultSchema = object({
	data: object({
		rankings: array(leaderboardResultSchema)
	})
});
const getGameResultsResultSchema = object({
	data: object({
		results: array(required(gameResultSchema)),
		more: boolean(),
		offset: number([integer()]),
		limit: number([integer()])
	})
});

const upsertUserResultSchema = object({
	data: object({
		userId: number(),
		username: string()
	})
});

const saveGameResultSchema = object({
	data: object({
		gameNum: number(),
		answers: string(),
		userId: number()
	})
});

export function createApiWordlettuceClient(event: RequestEvent) {
	const wordlettuce = createApiWordLettuceFetcher(event);

	async function upsertUser({ id, login }: { id: number; login: string }) {
		const result = await toResult(wordlettuce.put(`/v1/users/${id}`, { username: login }));
		if (result.status === 'ERROR') {
			throw error(500, result.error);
		}
		const parseResult = safeParse(upsertUserResultSchema, result.data);
		if (!parseResult.success) {
			throw error(500, 'Invalid data from api-wordlettuce.');
		}
		return parseResult.output.data;
	}

	async function getGames({
		user,
		count = 30,
		offset = 0
	}: {
		user: string;
		count: number;
		offset: number;
	}) {
		const result = await toResult(
			wordlettuce.get('/v1/game-results', { username: user, count, offset })
		);
		if (result.status === 'ERROR') {
			throw error(500, result.error);
		}
		const parseResult = safeParse(getGameResultsResultSchema, result.data);
		if (!parseResult.success) {
			throw error(500, 'Invalid data from api-wordlettuce.');
		}
		return parseResult.output.data;
	}

	async function getRankings() {
		const result = await toResult(wordlettuce.get('/v2/rankings'));
		if (result.status === 'ERROR') {
			throw error(500, result.error);
		}
		const parseResult = safeParse(getRankinsResultSchema, result.data);
		if (!parseResult.success) {
			throw error(500, 'Invalid data from api-wordlettuce.');
		}
		return parseResult.output.data;
	}

	async function saveGame({
		userId,
		gameNum,
		answers
	}: {
		userId: number;
		gameNum: number;
		answers: string;
	}) {
		const result = await toResult(
			wordlettuce.post('/v1/game-results', { userId, gameNum, answers })
		);
		if (result.status === 'ERROR') {
			throw error(500, result.error);
		}
		const parseResult = safeParse(saveGameResultSchema, result.data);
		console.log(JSON.stringify(parseResult));
		if (!parseResult.success) {
			throw error(500, 'Invalid data from api-wordlettuce.');
		}
		return parseResult.output.data;
	}

	return {
		upsertUser,
		getGames,
		getRankings,
		saveGame
	};
}
