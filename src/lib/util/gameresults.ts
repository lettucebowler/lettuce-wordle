import type { GameResult } from '$lib/types/gameresult';
import { createApiWordlettuceClient } from '$lib/client/apiWordlettuce.server';
import type { UserProfile } from '$lib/types/auth';
import type { RequestEvent } from '@sveltejs/kit';

export const providerEnum = ['all', 'd1'] as const;
type ProviderTuple = typeof providerEnum;
export type Provider = ProviderTuple[number];

export type getGameResultsInput = { user: string; count: number; offset: number };
export async function getGameResults({
	event,
	provider,
	data
}: {
	event: RequestEvent;
	provider: Provider;
	data: getGameResultsInput;
}) {
	switch (provider) {
		case 'd1':
			const { getGameResults } = createApiWordlettuceClient(event);
			return getGameResults(data);
		default:
			throw new Error('invalid provider');
	}
}

export async function getRankings({
	event,
	provider
}: {
	event: RequestEvent;
	provider: Provider;
}) {
	switch (provider) {
		case 'd1':
			const { getRankings } = createApiWordlettuceClient(event);
			return getRankings();
		default:
			throw new Error('invalid provider');
	}
}

export type saveGameResultsInput = { gameResult: GameResult; userId: number };
export async function saveGameResults({
	event,
	provider,
	data
}: {
	event: RequestEvent;
	provider: Provider;
	data: saveGameResultsInput;
}) {
	switch (provider) {
		case 'all':
			const { saveGameResults: saveGameResultsD1 } = createApiWordlettuceClient(event);
			await saveGameResultsD1(data);
			return data.gameResult;
		case 'd1':
			const { saveGameResults } = createApiWordlettuceClient(event);
			await saveGameResults(data);
			return data.gameResult;
		default:
			throw new Error('invalid provider');
	}
}

export type upsertUserInput = Pick<UserProfile, 'login' | 'id'>;
export async function upsertUser({
	event,
	provider,
	data
}: {
	event: RequestEvent;
	provider: Provider;
	data: upsertUserInput;
}) {
	switch (provider) {
		case 'all':
			const { upsertUser: upsertUserD1 } = createApiWordlettuceClient(event);
			await upsertUserD1(data);
			return data;
		case 'd1':
			const { upsertUser } = createApiWordlettuceClient(event);
			await upsertUser(data);
			return data;
		default:
			throw new Error('invalid provider');
	}
}
