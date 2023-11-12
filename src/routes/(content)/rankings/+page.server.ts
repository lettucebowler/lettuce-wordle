import { DEFAULT_DB_PROVIDER } from '$env/static/private';
import { getRankings, type Provider } from '$lib/util/gameresults';
import { delay } from '../utils.js';

export async function load(event) {
	const provider = event.locals.getDbProvider();
	const rankings = getRankings({
		event,
		provider: provider ?? (DEFAULT_DB_PROVIDER as Provider)
	});

	const result = await Promise.race([delay(100), rankings]);

	return {
		leaderboard: {
			scores: !event.isDataRequest ? await rankings : result ? result : rankings
		}
	};
}
