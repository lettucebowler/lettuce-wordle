import type { GameResult, LeaderboardResults } from '$lib/types/gameresult';
import {
	getGameResults as getGameResultsD1,
	getLeaderBoardResults as getLeaderBoardResultsD1,
	saveGameResults as saveGameResultsD1,
	upsertUser as upsertUserD1
} from '$lib/client/apiWordlettuce';
import {
	getGameResults as getGameResultsPlanetscale,
	getLeaderBoardResults as getLeaderBoardResultsPlanetscale,
	saveGameResults as saveGameResultsPlanetscale,
	upsertUser as upserUserPlanetscale
} from '$lib/client/planetscale';
import type { UserRecord } from '$lib/types/auth';

export const getGameResults = async (user: string, count: number, provider: string) => {
	const before = new Date().getTime();
	let gameResults: GameResult[];
	switch (provider) {
		case 'planetscale':
			gameResults = await getGameResultsPlanetscale(user, count);
			break;
		case 'd1':
			gameResults = await getGameResultsD1(user, count);
			break;
		default:
			throw Error('invalid provider');
	}
	const after = new Date().getTime();
	console.log(`load game results from ${provider}:`, after - before);
	return gameResults as GameResult[];
};

export const getLeaderBoardResults = async (gamenum: number, provider: string) => {
	const before = new Date().getTime();
	let leaderboardResults;
	switch (provider) {
		case 'planetscale':
			leaderboardResults = await getLeaderBoardResultsPlanetscale(gamenum);
			break;
		case 'd1':
			leaderboardResults = await getLeaderBoardResultsD1(gamenum);
			break;
		default:
			throw Error('invalid provider');
	}
	const after = new Date().getTime();
	console.log(`get leaderboard results from ${provider}:`, after - before);
	return leaderboardResults as LeaderboardResults[];
};

export const saveGameResults = async (gameResult: GameResult, provider: string) => {
	const before = new Date().getTime();
	let result;
	const providers = new Map([
		['d1', saveGameResultsD1],
		['planetscale', saveGameResultsPlanetscale]
	]);
	if (provider === 'all') {
		const saveGameFunctions = Array.from(providers.values());
		for (const saveGameFunction of saveGameFunctions) {
			await saveGameFunction(gameResult);
		}
		result = gameResult;
	} else {
		const saveGameFunction = providers.get(provider);
		if (!saveGameFunction) {
			throw Error('invalid provider');
		}
		result = await saveGameFunction(gameResult);
	}

	const after = new Date().getTime();
	console.log(`save game results to ${provider}:`, after - before);
	return result;
};

export const upsertUser = async (user: UserRecord, provider: string) => {
	const before = new Date().getTime();
	let result;
	const providers = new Map([
		['planetscale', upserUserPlanetscale],
		['d1', upsertUserD1]
	]);
	if (provider === 'all') {
		const upsertUserFunctions = Array.from(providers.values());
		for (const upsertUserFunction of upsertUserFunctions) {
			await upsertUserFunction(user);
		}
		result = user;
	} else {
		const upsertUserFunction = providers.get(provider);
		if (!upsertUserFunction) {
			throw Error('invalid provider');
		}
		result = await upsertUserFunction(user);
	}
	const after = new Date().getTime();
	console.log(`upsert user info to ${provider}:`, after - before);
	return result;
};
