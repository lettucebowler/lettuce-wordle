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

	return {
		upsertUser,
		saveGame
	};
}
