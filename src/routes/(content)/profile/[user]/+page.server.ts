import { getGameResults } from '$lib/util/gameresults';
const page_size = 30;
export async function load(event) {
	const searchParams = event.url.searchParams;
	const offset = Number(searchParams.get('offset')) || 0;
	const user = event.params.user;
	const dbProvider = event.locals.getDbProvider();
	const { results, more } = await getGameResults(user, page_size, dbProvider, offset);
	return {
		user,
		results,
		more,
		offsets: {
			current: offset,
			next: offset + page_size,
			previous: offset >= page_size ? offset - page_size : 0
		},
		dbProvider: dbProvider
	};
}
