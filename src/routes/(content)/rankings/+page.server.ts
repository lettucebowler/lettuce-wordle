import { DEFAULT_DB_PROVIDER } from '$env/static/private';
import { getRankings, type Provider } from '$lib/util/gameresults';

async function delay(ms: number): Promise<undefined> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function load(event) {
	const provider = event.locals.getDbProvider();
	const rankings = getRankings({
		event,
		provider: provider ?? (DEFAULT_DB_PROVIDER as Provider)
	});

	const result = await Promise.race([delay(50), rankings]);

	return {
		leaderboard: {
			scores: !event.isDataRequest ? await rankings : result ? result : rankings
		}
	};
}
