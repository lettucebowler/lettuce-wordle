import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';

export async function load(event) {
	const { getRankings } = createWordlettuceBetaDao(event);
	const rankings = getRankings();

	event.setHeaders({
		'Cache-Control': 'max'
	});

	return {
		rankings: event.isDataRequest ? rankings : await rankings
	};
}
