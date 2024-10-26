// import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';

export async function load(event) {
	// const { getRankings } = createWordlettuceBetaDao();
	const apiWordlettuce = createApiWordlettuceClient(event);
	// const dao = createWordlettuceBetaDao(event);
	// const rankings = await apiWordlettuce.getRankings();
	const rankings = await apiWordlettuce.getRankings();

	event.setHeaders({
		'Cache-Control': 'public,max-age=60'
	});

	return {
		rankings: event.isDataRequest ? rankings : await rankings
	};
}
