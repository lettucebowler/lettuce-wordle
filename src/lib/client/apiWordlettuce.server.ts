import { StatusError, fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_HOST, API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { type GameResult, gameResultSchema, leaderboardResultSchema } from '$lib/types/gameresult';
import type { UserProfile } from '$lib/types/auth';
import {
	array,
	number,
	object,
	integer,
	minValue,
	safeParse,
	literal,
	union,
	string,
	partial
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
			results: array(partial(gameResultSchema)),
			totalCount: number()
		})
	})
]);
export const getGameResults = async (user: string, count: number, offset = 0) => {
	const getGameResultsResponse = await apiWordlettuce.get(`/v1/users/${user}/gameresults`, {
		count,
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
			created: partial(gameResultSchema)
		})
	})
]);
export const saveGameResults = async (gameresult: GameResult) => {
	const { user, gamenum, ...rest } = gameresult;
	const response = await apiWordlettuce.put(`/v1/users/${user}/gameresults/${gamenum}`, rest);
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
			created: object({
				github_id: number(),
				username: string(),
				id: number()
			})
		})
	})
]);
export const upsertUser = async (user: UserProfile) => {
	const { login: username, id: github_id } = user;
	const response = await apiWordlettuce.post('/v1/users', { username, github_id });
	const parseResult = safeParse(upsertUserResponseSchema, response);
	if (!parseResult.success || !parseResult.output.success) {
		throw new StatusError(500, 'Failed to upsert user');
	}
	return parseResult.output.data;
};
