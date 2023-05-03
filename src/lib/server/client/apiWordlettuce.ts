import { fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_HOST, API_WORDLETTUCE_TOKEN } from '$env/static/private';

import type { GameResult, LeaderboardResults } from '$lib/types/gameresult';
import type { UserRecord } from '$lib/types/auth';

const apiWordlettuce = fetcher({
	base: `${API_WORDLETTUCE_HOST}`,
	transformRequest(req) {
		req.headers['Authorization'] = `Bearer ${API_WORDLETTUCE_TOKEN}`;
		return req;
	}
});

export const getGameResults = async (user: string, count: number, offset = 0) => {
	const { results, totalCount } = (await apiWordlettuce.get(`/v1/users/${user}/gameresults`, {
		count,
		offset
	})) as { results: GameResult[]; totalCount: number };
	return {
		results: results as GameResult[],
		totalCount
	};
};

export const getLeaderBoardResults = async (gamenum: number) => {
	const leaderboardResults = await apiWordlettuce.get('/v1/rankings', {
		gamenum
	});
	return leaderboardResults as LeaderboardResults[];
};

export const saveGameResults = async (gameresult: GameResult) => {
	const { user, gamenum, ...rest } = gameresult;
	const results = await apiWordlettuce.put(`/v1/users/${user}/gameresults/${gamenum}`, rest);
	return results;
};

export const upsertUser = async (user: UserRecord) => {
	const results = await apiWordlettuce.post('/v1/users', user);
	return results;
};
