import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';
// import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server.js';

export async function load(event) {
	const parentData = await event.parent();
	const { user } = event.params;
	const searchParams = event.url.searchParams;
	const startParam = Number(searchParams.get('start')) || parentData.gameNum;
	// const { getNextPageAfter } = createWordlettuceBetaDao();
	const apiWordlettuce = createApiWordlettuceClient(event);
	const limit = 30;
	// const { results, next } = await getNextPageAfter({ username: user, limit, start: startParam });
	const { results, next } = await apiWordlettuce.getNextPageAfter({
		username: user,
		limit,
		start: startParam
	});
	// event.setHeaders({
	// 	'Cache-Control': 'max-age=300'
	// });
	return {
		user,
		start: startParam,
		next: next,
		results,
		limit,
		...parentData
	};
}
