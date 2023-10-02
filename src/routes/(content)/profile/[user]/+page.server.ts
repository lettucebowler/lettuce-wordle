import { getGameResults } from '$lib/util/gameresults';
export async function load(event) {
	const searchParams = event.url.searchParams;
	const offset = Number(searchParams.get('offset')) || 0;
	const user = event.params.user;
	const { results, totalCount } = await getGameResults(user, 30, event.locals.dbProvider, offset);
	return {
		user,
		results,
		totalCount,
		offsets: {
			current: offset,
			next: offset + 30,
			previous: offset >= 30 ? offset - 30 : 0
		},
		dbProvider: event.locals.dbProvider
	};
}
