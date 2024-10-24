import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';

export async function load(event) {
	const { getRankings } = createWordlettuceBetaDao();
	const rankings = getRankings();

	// event.setHeaders({
	// 	'Cache-Control': 'max-age=60'
	// });

	return {
		rankings: event.isDataRequest ? rankings : await rankings
	};
}
