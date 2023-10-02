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
	boolean,
	literal,
	string
} from 'valibot';

const apiWordlettuce = fetcher({
	base: `${API_WORDLETTUCE_HOST}`,
	transformRequest(req) {
		req.headers['Authorization'] = `Bearer ${API_WORDLETTUCE_TOKEN}`;
		return req;
	}
});

const getGameResultsResponseSchema = object({
	results: array(gameResultSchema),
	totalCount: number([integer(), minValue(0)])
});
export const getGameResults = async (user: string, count: number, offset = 0) => {
	const getGameResultsResponse = await apiWordlettuce.get(`/v1/users/${user}/gameresults`, {
		count,
		offset
	});
	const parseResult = safeParse(getGameResultsResponseSchema, getGameResultsResponse);
	if (!parseResult.success) {
		throw new StatusError(500, 'Invalid data from api-wordlettuce');
	}
	return parseResult.output;
};

const getRankingsResponseSchema = array(leaderboardResultSchema);
export const getRankings = async (gamenum: number) => {
	const response = await apiWordlettuce.get('/v1/rankings', {
		gamenum
	});
	const parseResult = safeParse(getRankingsResponseSchema, response);
	if (!parseResult.success) {
		throw new StatusError(500, 'Invalid data from api-wordlettuce');
	}
	return parseResult.output;
};

const saveGameResultResponseSchema = literal('created');
export const saveGameResults = async (gameresult: GameResult) => {
	const { user, gamenum, ...rest } = gameresult;
	const response = await apiWordlettuce.put(`/v1/users/${user}/gameresults/${gamenum}`, rest);
	const parseResult = safeParse(saveGameResultResponseSchema, response);
	if (!parseResult.success) {
		throw new StatusError(500, 'Failed to save game result');
	}
	return parseResult.output;
};

const upsertUserResponseSchema = literal('created');
export const upsertUser = async (user: UserProfile) => {
	const { login: username, id: github_id } = user;
	const response = await apiWordlettuce.post('/v1/users', { username, github_id });
	const parseResult = safeParse(upsertUserResponseSchema, response);
	if (!parseResult.success) {
		throw new StatusError(500, 'Failed to upsert user');
	}
	return parseResult.output;
};
