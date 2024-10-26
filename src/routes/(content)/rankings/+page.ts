// import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';
import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.client.js';

export async function load(event) {
	// const { getRankings } = createWordlettuceBetaDao();
	const apiWordlettuce = createApiWordlettuceClient(event);
	const rankings = await apiWordlettuce.getRankings();

	event.setHeaders({
		'Cache-Control': 'public,max-age=60'
	});

	return {
		rankings
	};
}