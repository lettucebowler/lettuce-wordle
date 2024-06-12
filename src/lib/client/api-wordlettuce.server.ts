import { type StatusError, fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_HOST, API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import { NonNegativeIntegerSchema, PositiveIntegerSchema } from '$lib/schemas/util';
import * as v from 'valibot';

import { GameNumSchema, GameResultSchema } from '$lib/schemas/game';

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

const GetRankingsResultSchema = v.object({
	data: v.object({
		rankings: v.array(
			v.object({
				user: v.string(),
				games: PositiveIntegerSchema,
				score: PositiveIntegerSchema
			})
		)
	})
});

const GetGamesResultSchema = v.object({
	data: v.object({
		results: v.array(v.required(GameResultSchema)),
		more: v.boolean(),
		offset: NonNegativeIntegerSchema,
		limit: PositiveIntegerSchema
	})
});

const UpsertUserResultSchema = v.object({
	data: v.object({
		userId: PositiveIntegerSchema,
		username: v.string()
	})
});

const SaveGameResultSchema = v.object({
	data: v.object({
		gameNum: GameNumSchema,
		answers: v.string(),
		userId: PositiveIntegerSchema
	})
});

export function createApiWordlettuceClient(event: RequestEvent) {
	const wordlettuce = createApiWordLettuceFetcher(event);

	async function upsertUser({ id, login }: { id: number; login: string }) {
		const result = await toResult(wordlettuce.put(`/v1/users/${id}`, { username: login }));
		if (result.status === 'ERROR') {
			throw error(500, result.error);
		}
		const parseResult = v.safeParse(UpsertUserResultSchema, result.data);
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
		const parseResult = v.safeParse(GetGamesResultSchema, result.data);
		if (!parseResult.success) {
			console.log(v.flatten(parseResult.issues));
			throw error(500, 'Invalid data from api-wordlettuce.');
		}
		return parseResult.output.data;
	}

	async function getRankings() {
		const result = await toResult(wordlettuce.get('/v2/rankings'));
		if (result.status === 'ERROR') {
			throw error(500, result.error);
		}
		const parseResult = v.safeParse(GetRankingsResultSchema, result.data);
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
		const parseResult = v.safeParse(SaveGameResultSchema, result.data);
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
