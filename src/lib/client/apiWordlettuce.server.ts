import { StatusError, fetcher, type FetcherType } from 'itty-fetcher';
import { API_WORDLETTUCE_HOST, API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { gameResultSchema, leaderboardResultSchema } from '$lib/types/gameresult';
import { array, number, object, safeParse, literal, union, string, boolean } from 'valibot';
import type { LoadEvent, RequestEvent, ServerLoadEvent } from '@sveltejs/kit';

import type {
	getGameResultsInput,
	saveGameResultsInput,
	upsertUserInput
} from '$lib/util/gameresults';
const getGameResultsResponseSchema = union([
	object({
		success: literal(false),
		message: string()
	}),
	object({
		success: literal(true),
		data: object({
			results: array(gameResultSchema),
			more: boolean()
		})
	})
]);
async function getGameResults(fetcher: FetcherType, data: getGameResultsInput) {
	const getGameResultsResponse = await fetcher.get(`/v1/game-results`, {
		username: data.user,
		limit: data.count,
		offset: data.offset
	});
	const parseResult = safeParse(getGameResultsResponseSchema, getGameResultsResponse);
	if (!parseResult.success || !parseResult.output.success) {
		throw new StatusError(500, 'Invalid data from api-wordlettuce');
	}
	return parseResult.output.data;
}

const getRankingsResponseSchema = union([
	object({
		success: literal(true),
		data: object({
			rankings: array(leaderboardResultSchema)
		})
	}),
	object({
		success: literal(false),
		message: string()
	})
]);
async function getRankings(fetcher: FetcherType) {
	const response = await fetcher.get('/v2/rankings').catch((e) => e);
	const parseResult = safeParse(getRankingsResponseSchema, response);
	if (!parseResult.success || !parseResult.output.success) {
		throw new StatusError(500, 'Invalid data from api-wordlettuce');
	}
	return parseResult.output.data;
}

const saveGameResultResponseSchema = union([
	object({
		success: literal(false),
		message: string()
	}),
	object({
		success: literal(true),
		data: object({
			gameNum: number(),
			answers: string(),
			userId: number()
		})
	})
]);
async function saveGameResults(fetcher: FetcherType, data: saveGameResultsInput) {
	const response = await fetcher.post('/v1/game-results', {
		userId: data.userId,
		...data.gameResult
	});
	const parseResult = safeParse(saveGameResultResponseSchema, response);
	if (!parseResult.success) {
		throw new StatusError(500, 'Failed to save game result');
	}
	return parseResult.output;
}

const upsertUserResponseSchema = union([
	object({
		success: literal(false),
		message: string()
	}),
	object({
		success: literal(true),
		data: object({
			userId: number(),
			username: string()
		})
	})
]);
async function upsertUser(fetcher: FetcherType, data: upsertUserInput) {
	const response = await fetcher.put(`/v1/users/${data.id}`, { username: data.login });
	const parseResult = safeParse(upsertUserResponseSchema, response);
	if (!parseResult.success || !parseResult.output.success) {
		throw new StatusError(500, 'Failed to upsert user');
	}
	return parseResult.output.data;
}

export function createApiWordlettuceClient(event: ServerLoadEvent | LoadEvent | RequestEvent) {
	const apiWordlettuce = fetcher({
		base: `${API_WORDLETTUCE_HOST}`,
		transformRequest(req) {
			req.headers['Authorization'] = `Bearer ${API_WORDLETTUCE_TOKEN}`;
			return req;
		},
		fetch: event.fetch
	});

	return {
		fetcher: apiWordlettuce,
		upsertUser: (data: upsertUserInput) => upsertUser(apiWordlettuce, data),
		saveGameResults: (data: saveGameResultsInput) => saveGameResults(apiWordlettuce, data),
		getRankings: () => getRankings(apiWordlettuce),
		getGameResults: (data: getGameResultsInput) => getGameResults(apiWordlettuce, data)
	};
}
