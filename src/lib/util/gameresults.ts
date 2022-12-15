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

export const getGameResults = async (user: string, count: number, provider: string) => {
	let gameResults: GameResult[];
	switch (provider) {
		case 'planetscale':
			gameResults = await getGameResultsPlanetscale(user, count);
			break;
		case 'd1':
			gameResults = await getGameResultsKV(user, count);
			break;
		default:
			throw Error('invalid provider');
	}
	return gameResults as GameResult[];
};

export const getLeaderBoardResults = async (gamenum: number, provider: string) => {
	let leaderboardResults;
	switch (provider) {
		case 'planetscale':
			leaderboardResults = await getLeaderBoardResultsPlanetscale(gamenum);
			break;
		case 'd1':
			leaderboardResults = await getLeaderBoardResultsKV(gamenum);
			break;
		default:
			throw Error('invalid provider');
	}
	return leaderboardResults as LeaderboardResults[];
};

export const saveGameResults = async (gameResult: GameResult, provider: string) => {
	let result;
	switch (provider) {
		case 'planetscale':
			result = await saveGameResultsPlanetscale(gameResult);
			break;
		case 'd1':
			result = await saveGameResultsKV(gameResult);
			break;
		default:
			throw Error('invalid provider');
	}
	return result;
};
