import type { GameResult, LeaderboardResults } from '$lib/types/gameresult';
import { DEFAULT_DB_PROVIDER } from '$env/static/private';
import {
	getGameResults as getGameResultsD1,
	getLeaderBoardResults as getLeaderBoardResultsD1,
	saveGameResults as saveGameResultsD1,
	upsertUser as upsertUserD1
} from '$lib/server/client/apiWordlettuce';
import {
	getGameResults as getGameResultsPlanetscale,
	getLeaderBoardResults as getLeaderBoardResultsPlanetscale,
	saveGameResults as saveGameResultsPlanetscale,
	upsertUser as upserUserPlanetscale
} from '$lib/server/client/planetscale';
import type { UserRecord } from '$lib/types/auth';

export const getGameResults = async (
	user: string,
	count: number,
	provider: string = DEFAULT_DB_PROVIDER,
	offset = 0
) => {
	console.time(`load game results from ${provider}`);
	let gameResults: GameResult[] = [];
	let totalCount = 0;
	let results;
	console.log(provider);
	switch (provider) {
		case 'planetscale':
			results = await getGameResultsPlanetscale(user, count, offset);
			gameResults = results.results;
			totalCount = results.totalCount;
			break;
		case 'd1':
			results = await getGameResultsD1(user, count, offset);
			gameResults = results.results;
			totalCount = results.totalCount;
			break;
		default:
			throw Error('invalid provider');
	}
	console.timeEnd(`load game results from ${provider}`);
	return {
		totalCount,
		results: gameResults as GameResult[]
	};
};

export const getLeaderBoardResults = async (gamenum: number, provider: string) => {
	console.time(`get leaderboard results from ${provider}`);
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
	console.timeEnd(`get leaderboard results from ${provider}`);
	return leaderboardResults as LeaderboardResults[];
};

export const saveGameResults = async (gameResult: GameResult, provider: string) => {
	console.time(`save game results to ${provider}:`);
	let result;
	const providers = new Map([
		['d1', saveGameResultsD1],
		['planetscale', saveGameResultsPlanetscale]
	]);
	if (provider === 'all') {
		const saveGameFunctions = Array.from(providers.values());
		for (const saveGameFunction of saveGameFunctions) {
			console.time('save game results');
			await saveGameFunction(gameResult);
			console.timeEnd('save game results');
		}
		result = gameResult;
	} else {
		const saveGameFunction = providers.get(provider);
		if (!saveGameFunction) {
			throw Error('invalid provider');
		}
		result = await saveGameFunction(gameResult);
	}

	console.timeEnd(`save game results to ${provider}:`);
	return result;
};

export const upsertUser = async (user: UserRecord, provider: string) => {
	console.time(`upsert user info to ${provider}:`);
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
	console.timeEnd(`upsert user info to ${provider}:`);
	return result;
};
