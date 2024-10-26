// import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';

export async function load(event) {
	// const { getRankings } = createWordlettuceBetaDao();
	const apiWordlettuce = createApiWordlettuceClient(event);
	const rankings = apiWordlettuce.getRankings();

	event.setHeaders({
		'Cache-Control': 'public,max-age=60'
	});

	return {
		rankings: event.isDataRequest ? rankings : await rankings
	};
}
