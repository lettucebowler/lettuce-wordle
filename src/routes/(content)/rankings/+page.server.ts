import { createWordlettuceBetaDao } from '$lib/dao/wordlettuce-beta.server';

export async function load(event) {
	const { getRankings } = createWordlettuceBetaDao(event);
	const rankings = getRankings();

	event.setHeaders({
		'Cache-Control': 'max-age=300'
	});

	return {
		rankings: event.isDataRequest ? rankings : await rankings
	};
}
