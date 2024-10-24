import { fetcher } from 'itty-fetcher';

type GameResult = {
	gameNum: number;
	answers: string;
};

export async function load(event) {
	const parentData = await event.parent();
	const { user } = event.params;
	const searchParams = event.url.searchParams;
	const startParam = Number(searchParams.get('start')) || parentData.gameNum;
	const apiWordlettuce = fetcher({ fetch: event.fetch });
	const { results, start, next } = await apiWordlettuce.get<{
		results: GameResult[];
		start: number;
		next: number | null;
	}>('/api/v1/game-results', { user, start: startParam });
	// event.setHeaders({
	// 	'Cache-Control': 'max-age=300'
	// });
	return {
		user,
		start,
		next,
		results,
		...parentData
	};
}
