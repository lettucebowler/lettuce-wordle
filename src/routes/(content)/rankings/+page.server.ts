// import { getGameNum } from '$lib/util/share';
import { DEFAULT_DB_PROVIDER } from '$env/static/private';
import { getRankings, type Provider } from '$lib/util/gameresults';
export async function load(event) {
	const provider = event.locals.getDbProvider();
	const rankings = await getRankings({
		event,
		provider: provider ?? (DEFAULT_DB_PROVIDER as Provider)
	});

	return {
		leaderboard: {
			scores: rankings
		}
	};
}
