import { fetcher } from 'itty-fetcher';
import { API_WORDLETTUCE_TOKEN } from '$env/static/private';
import { PUBLIC_API_WORDLETTUCE_HOST } from '$env/static/public';

import { error as svelteError, type RequestEvent } from '@sveltejs/kit';

export function createApiWordLettuceFetcher(event: RequestEvent) {
	return fetcher({
		fetch: event.fetch,
		base: PUBLIC_API_WORDLETTUCE_HOST,
		headers: {
			Authorization: `Bearer ${API_WORDLETTUCE_TOKEN}`
		}
	});
}

export function createApiWordlettuceClient(event: RequestEvent) {
	const wordlettuce = createApiWordLettuceFetcher(event);

	async function upsertUser({ id, login }: { id: number; login: string }) {
		const { error } = await wordlettuce
			.put(`/v1/users/${id}`, { username: login })
			.then((data) => ({ data, error: undefined }))
			.catch((error) => ({ error, data: undefined }));
		if (error) {
			throw svelteError(500, error);
		}
	}

	async function saveGame({
		userId,
		gameNum,
		answers
	}: {
		userId: number;
		gameNum: number;
		answers: string;
	}) {
		const { data, error } = await wordlettuce
			.post<{ gameNum: number; userId: string; answers: string; attempts: number }>(
				'/v1/game-results',
				{ userId, gameNum, answers }
			)
			.then((data) => ({ data, error: undefined }))
			.catch((error) => ({ error, data: undefined }));
		if (error) {
			throw svelteError(500, error);
		}
		return data ? [data] : [];
	}

	async function getNextPageAfter({
		username,
		limit = 30,
		start
	}: {
		username: string;
		limit?: number;
		start: number;
	}) {
		const { data, error } = await wordlettuce
			.get<{
				limit: number;
				start: number;
				next: number;
				results: Array<{ gameNum: number; attempts: number; answers: string; userId: number }>;
			}>('/v1/game-results', { username, limit, start })
			.then((data) => ({ data, error: undefined }))
			.catch((error) => ({ error: error as Error, data: undefined }));
		if (error) {
			throw svelteError(500, error);
		}
		return data;
	}

	async function getRankings() {
		const { data, error } = await wordlettuce
			.get<{ rankings: Array<{ user: string; games: number; score: number }> }>('/v2/rankings')
			.then((data) => ({ data, error: undefined }))
			.catch((error) => ({ error, data: undefined }));
		if (error || !data) {
			throw svelteError(500, error);
		}
		return data.rankings;
	}

	return {
		upsertUser,
		saveGame,
		getNextPageAfter,
		getRankings
	};
}
