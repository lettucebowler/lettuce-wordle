import type { GameResult, LeaderboardResult } from '$lib/types/gameresult';
import { DEFAULT_DB_PROVIDER } from '$env/static/private';
import {
	getGameResults as getGameResultsD1,
	getRankings as getLeaderBoardResultsD1,
	saveGameResults as saveGameResultsD1,
	upsertUser as upsertUserD1
} from '$lib/client/apiWordlettuce.server';
import type { UserProfile } from '$lib/types/auth';

export const getGameResults = async (
	user: string,
	count: number,
	provider: string = DEFAULT_DB_PROVIDER,
	offset = 0
) => {
	let gameResults: {
		results: GameResult[];
		totalCount: number;
	};
	switch (provider) {
		case 'd1':
			gameResults = await getGameResultsD1(user, count, offset);
			break;
		default:
			throw Error('invalid provider');
	}
	return gameResults;
};

export const getLeaderBoardResults = async (provider: string) => {
	let leaderboardResults: LeaderboardResult[];
	switch (provider) {
		case 'd1':
			leaderboardResults = await getLeaderBoardResultsD1();
			break;
		default:
			throw Error('invalid provider');
	}
	return leaderboardResults;
};

export const saveGameResults = async (gameResult: GameResult, provider: string) => {
	let result;
	const providers = new Map([['d1', saveGameResultsD1]]);
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
	return result;
};

export const upsertUser = async (user: UserProfile, provider: string) => {
	let result;
	const providers = new Map([['d1', upsertUserD1]]);
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
	return result;
};
