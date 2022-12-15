import { fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_TOKEN, API_WORDLETTUCE_HOST } from '$env/static/private';

import type { GameResult, LeaderboardResults } from '$lib/types/gameresult';
import type { Profile } from '$lib/types/auth';

const apiWordlettuce = fetcher({
	base: `${API_WORDLETTUCE_HOST}/api`,
	transformRequest(req) {
		req.headers['Authorization'] = `Bearer ${API_WORDLETTUCE_TOKEN}`;
		return req;
	}
});

export const getProfile = async (key: string) => {
	let data = null;
	try {
		data = await apiWordlettuce.get(
			'/auth/get',
			{},
			{
				headers: {
					session: key
				}
			}
		);
	} catch (e) {
		console.log(e);
	}
	return data as Profile;
};

export const stashProfile = async (key: string, value: Profile) => {
	await apiWordlettuce.post('/auth/set', { session: key, profile: value });
	return value;
};

export const getGameResults = async (user: string, count: number) => {
	const gameResults = await apiWordlettuce.get(`/gameresults/${user}`, { count });
	return gameResults as GameResult[];
};

export const getLeaderBoardResults = async (gamenum: number) => {
	const leaderboardResults = await apiWordlettuce.get('/gameresults/leaderboard', { gamenum });
	return leaderboardResults as LeaderboardResults[];
};

export const saveGameResults = async (gameresult: GameResult) => {
	const results = await apiWordlettuce.post('/gameresults', gameresult);
	return results;
};
