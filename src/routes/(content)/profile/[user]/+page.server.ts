import type { GameResult } from '$lib/types/gameresult';
import { fetcher } from 'itty-fetcher';
const page_size = 30;
export async function load(event) {
	const searchParams = event.url.searchParams;
	const offset = Number(searchParams.get('offset')) || 0;
	const user = event.params.user;
	const wordlettuce = fetcher({
		fetch: event.fetch
	});
	const { more, results } = await wordlettuce.get<{
		results: GameResult[];
		more: boolean;
		offset: number;
		limit: number;
	}>('/api/v1/game-results', { user, limit: page_size, offset });
	return {
		user,
		results,
		more,
		offsets: {
			current: offset,
			next: offset + page_size,
			previous: offset >= page_size ? offset - page_size : 0
		}
	};
}
