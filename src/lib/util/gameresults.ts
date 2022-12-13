import type { GameResult, LeaderboardResults } from '$lib/types/gameresult';
import {
	getGameResults as getGameResultsKV,
	getLeaderBoardResults as getLeaderBoardResultsKV,
	saveGameResults as saveGameResultsKV
} from '$lib/client/apiWordlettuce';
import {
	getGameResults as getGameResultsPlanetscale,
	getLeaderBoardResults as getLeaderBoardResultsPlanetscale,
	saveGameResults as saveGameResultsPlanetscale
} from '$lib/client/planetscale';

export const getGameResults = async (user: string, count: number, provider = 'cf') => {
	let gameResults: GameResult[];
	switch (provider) {
		case 'planetscale':
			gameResults = await getGameResultsPlanetscale(user, count);
			break;
		default:
			gameResults = await getGameResultsKV(user, count);
			break;
	}
	return gameResults as GameResult[];
};

export const getLeaderBoardResults = async (gamenum: number, provider = 'cf') => {
	let leaderboardResults;
	switch (provider) {
		case 'planetscale':
			leaderboardResults = await getLeaderBoardResultsPlanetscale(gamenum);
			break;
		default:
			leaderboardResults = await getLeaderBoardResultsKV(gamenum);
			break;
	}
	return leaderboardResults as LeaderboardResults[];
};

export const saveGameResults = async (gameResult: GameResult, provider = 'cf') => {
	let result;
	switch (provider) {
		case 'planetscale':
			result = await saveGameResultsPlanetscale(gameResult);
			break;
		default:
			result = await saveGameResultsKV(gameResult);
			break;
	}
	return result;
};
