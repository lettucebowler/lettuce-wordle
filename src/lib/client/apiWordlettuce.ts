import { fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_TOKEN, API_WORDLETTUCE_HOST } from '$env/static/private';

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
	const { results } = (await apiWordlettuce.get(`/users/${user}/gameresults`, {
		count,
		offset
	})) as { results: GameResult[] };
	return results as GameResult[];
};

export const getLeaderBoardResults = async (gamenum: number) => {
	const leaderboardResults = await apiWordlettuce.get('/api/gameresults/leaderboard', { gamenum });
	return leaderboardResults as LeaderboardResults[];
};

export const saveGameResults = async (gameresult: GameResult) => {
	const { username, gamenum, ...rest } = gameresult;
	const results = await apiWordlettuce.put(`/users/${username}/gameresults/${gamenum}`, rest);
	return results;
};

export const upsertUser = async (user: UserRecord) => {
	const results = await apiWordlettuce.post('/users', user);
	return results;
};
