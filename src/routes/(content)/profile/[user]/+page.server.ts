import { DEFAULT_DB_PROVIDER } from '$env/static/private';
import { getGameResults, type Provider } from '$lib/util/gameresults';
const page_size = 30;
export async function load(event) {
	const searchParams = event.url.searchParams;
	const offset = Number(searchParams.get('offset')) || 0;
	const user = event.params.user;
	const dbProvider = event.locals.getDbProvider();
	const { results, more } = await getGameResults({
		event,
		provider: dbProvider ?? (DEFAULT_DB_PROVIDER as Provider),
		data: { user, count: page_size, offset }
	});
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
