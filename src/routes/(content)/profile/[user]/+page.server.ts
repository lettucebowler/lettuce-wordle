import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server.js';
import { fetcher } from 'itty-fetcher';

type GameResult = {
	gameNum: number;
	answers: string;
};

export async function load(event) {
	const beforeParent = performance.now();
	const parentData = await event.parent();
	const afterParent = performance.now();
	console.log('parent data', afterParent - beforeParent);
	const { user } = event.params;
	const searchParams = event.url.searchParams;
	const startParam = Number(searchParams.get('start')) || parentData.gameNum;
	const { getNextPageAfter } = createWordlettuceBetaDao();
	const results = await getNextPageAfter({ username: user, limit: 30, start: startParam });
	event.setHeaders({
		'Cache-Control': 'max-age=300'
	});
	return {
		user,
		start: startParam,
		next: results.at(-1)?.gameNum ?? null,
		results: results.slice(0, 30),
		...parentData
	};
}
