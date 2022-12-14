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
	const before = new Date().getTime();
	let data = null;
	try {
		data = await apiWordlettuce.post('/auth/get', { session: key });
	} catch (e) {
		console.log(e);
	}
	const after = new Date().getTime();
	console.log('load profile from KV:', after - before);
	return data as Profile;
};

export const stashProfile = async (key: string, value: Profile) => {
	console.log('Stash profile to KV');
	const data = await apiWordlettuce.post('/auth/set', { session: key, profile: value });
	return data;
};

export const getGameResults = async (user: string, count: number) => {
	const before = new Date().getTime();
	const gameResults = await apiWordlettuce.get(`/gameresults/${user}`, { count });
	const after = new Date().getTime();
	console.log(`load results for last ${count} games for ${user} from D1:`, after - before);
	return gameResults as GameResult[];
};

export const getLeaderBoardResults = async (gamenum: number) => {
	const before = new Date().getTime();
	const leaderboardResults = await apiWordlettuce.get('/gameresults/leaderboard', { gamenum });
	const after = new Date().getTime();
	console.log(`load results for leaderboard game ${gamenum} from D1:`, after - before);
	return leaderboardResults as LeaderboardResults[];
};

export const saveGameResults = async (gameresult: GameResult) => {
	const before = new Date().getTime();
	const results = await apiWordlettuce.post('/gameresults', gameresult);
	const after = new Date().getTime();
	console.log('save game results to D1:', after - before);
	return results;
};