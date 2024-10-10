import { fetcher } from 'itty-fetcher';

type GameResult = {
	gameNum: number;
	answers: string;
};

export async function load(event) {
	const { user } = event.params;
	const searchParams = event.url.searchParams;
	const page = Number(searchParams.get('page')) || 1;
	const apiWordlettuce = fetcher({ fetch: event.fetch });
	const { results, more } = await apiWordlettuce.get<{
		results: GameResult[];
		more: boolean;
	}>('/api/v1/game-results', { user, page });
	return {
		user,
		page,
		more,
		results
	};
}
