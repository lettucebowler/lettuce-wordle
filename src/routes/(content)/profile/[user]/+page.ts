import { fetcher } from 'itty-fetcher';

type GameResult = {
	gameNum: number;
	answers: string;
};

export async function load(event) {
	const parentData = await event.parent();
	console.log(parentData);
	const { user } = event.params;
	const searchParams = event.url.searchParams;
	const startParam = Number(searchParams.get('start')) || parentData.gameNum;
	const apiWordlettuce = fetcher({ fetch: event.fetch });
	const { results, next, limit } = await apiWordlettuce.get<{
		results: GameResult[];
		next: number;
		limit: number;
	}>('/api/v1/game-results', { user, start: startParam });
	return {
		user,
		results,
		next,
		limit,
		start: startParam
	};
}
