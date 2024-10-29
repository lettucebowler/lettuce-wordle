import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server';
import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';

export async function load(event) {
	const parentData = await event.parent();
	const { user } = event.params;
	const searchParams = event.url.searchParams;
	const startParam = Number(searchParams.get('start')) || parentData.gameNum;
	const db = createWordlettuceBetaDao(event);
	// const apiWordlettuce = createApiWordlettuceClient(event);
	// const { results, next } = await getNextPageAfter({ username: user, limit, start: startParam });
	const { results, next, limit } = await db.getNextPageAfter({
		username: user,
		start: startParam
	});
	// event.setHeaders({
	// 	'Cache-Control': 'max-age=300'
	// });
	const data = {
		user,
		start: startParam,
		next: next,
		results,
		limit,
		...parentData
	};
	return data;
}
