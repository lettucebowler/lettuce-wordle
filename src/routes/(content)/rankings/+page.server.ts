import { DEFAULT_DB_PROVIDER } from '$env/static/private';
import { getRankings, type Provider } from '$lib/util/gameresults';
import { delay } from '../utils.js';

// import type { ServerLoadEvent } from '@sveltejs/kit';
// async function getDelayedRankings(event: ServerLoadEvent, provider: Provider = DEFAULT_DB_PROVIDER as Provider) {
// 	await delay(500);
// 	return getRankings({
// 		event,
// 		provider: provider ?? (DEFAULT_DB_PROVIDER as Provider)
// 	});
// }

export async function load(event) {
	const provider = event.locals.getDbProvider();
	const rankings = getRankings({
		event,
		provider: provider ?? (DEFAULT_DB_PROVIDER as Provider)
	});
	// const rankings = getDelayedRankings(event, provider);

	const result = await Promise.race([delay(100), rankings]);

	return {
		leaderboard: {
			scores: !event.isDataRequest ? await rankings : result ? result : rankings
		}
	};
}
