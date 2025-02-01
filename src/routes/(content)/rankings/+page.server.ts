import { createWordLettuceDao } from '$lib/dao/wordlettuce.server';
// import { createApiWordlettuceClient } from '$lib/client/api-wordlettuce.server.js';

export async function load(event) {
	const db = createWordLettuceDao(event);
	const rankings = db.getRankings();
	// const api = createApiWordlettuceClient(event);
	// const rankings = api.getRankings();

	event.setHeaders({
		'Cache-Control': 'public,max-age=60'
	});

	return {
		rankings: event.isDataRequest ? rankings : await rankings
	};
}

