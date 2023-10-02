import { getGameResults } from '$lib/util/gameresults';
export async function load(event) {
	const searchParams = event.url.searchParams;
	const offset = Number(searchParams.get('offset')) || 0;
	const user = event.params.user;
	const { totalCount, results: gameResults } = await getGameResults(
		user,
		30,
		event.locals.dbProvider,
		offset
	);
	const result = {
		profile: {
			gameResults: gameResults,
			gameCount: totalCount,
			user
		},
		nextOffset: offset + 30,
		prevOffset: offset >= 30 ? offset - 30 : 0,
		currentOffset: offset
	};
	if (event.locals.dbProviderOverwritten) {
		return {
			...result,
			dbProvider: event.locals.dbProvider
		};
	}
	return result;
}
