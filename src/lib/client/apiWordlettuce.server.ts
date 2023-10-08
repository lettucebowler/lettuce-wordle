import { StatusError, fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_HOST, API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { type GameResult, gameResultSchema, leaderboardResultSchema } from '$lib/types/gameresult';
import type { UserProfile } from '$lib/types/auth';
import {
	array,
	number,
	object,
	safeParse,
	literal,
	union,
	string,
	partial,
	boolean
} from 'valibot';

const apiWordlettuce = fetcher({
	base: `${API_WORDLETTUCE_HOST}`,
	transformRequest(req) {
		req.headers['Authorization'] = `Bearer ${API_WORDLETTUCE_TOKEN}`;
		return req;
	}
});

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
export const getGameResults = async (user: string, count: number, offset = 0) => {
	const getGameResultsResponse = await apiWordlettuce.get(`/v1/game-results`, {
		username: user,
		limit: count,
		offset
	});
	const parseResult = safeParse(getGameResultsResponseSchema, getGameResultsResponse);
	if (!parseResult.success || !parseResult.output.success) {
		throw new StatusError(500, 'Invalid data from api-wordlettuce');
	}
	return parseResult.output.data;
};

const getRankingsResponseSchema = union([
	object({
		success: literal(true),
		data: array(leaderboardResultSchema)
	}),
	object({
		success: literal(false),
		message: string()
	})
]);
export const getRankings = async () => {
	const response = await apiWordlettuce.get('/v1/rankings').catch((e) => e);
	const parseResult = safeParse(getRankingsResponseSchema, response);
	if (!parseResult.success || !parseResult.output.success) {
		console.log(parseResult);
		throw new StatusError(500, 'Invalid data from api-wordlettuce');
	}
	return parseResult.output.data;
};

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
export const saveGameResults = async ({
	gameResult,
	userId
}: {
	gameResult: GameResult;
	userId: number;
}) => {
	const response = await apiWordlettuce.put(
		`/v1/users/${userId}/game-results/${gameResult.gameNum}`,
		gameResult
	);
	const parseResult = safeParse(saveGameResultResponseSchema, response);
	if (!parseResult.success) {
		throw new StatusError(500, 'Failed to save game result');
	}
	return parseResult.output;
};

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
export const upsertUser = async (user: UserProfile) => {
	const response = await apiWordlettuce.put(`/v1/users/${user.id}`, { username: user.login });
	const parseResult = safeParse(upsertUserResponseSchema, response);
	if (!parseResult.success || !parseResult.output.success) {
		throw new StatusError(500, 'Failed to upsert user');
	}
	return parseResult.output.data;
};
