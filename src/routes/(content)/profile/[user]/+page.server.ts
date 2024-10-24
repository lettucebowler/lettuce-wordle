import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server.js';

export async function load(event) {
	const parentData = await event.parent();
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
