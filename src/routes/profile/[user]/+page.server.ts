import { getGameResults } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';
import { fetcher } from 'itty-fetcher';

const userInfo = fetcher();

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.params.user;
	const results = await getGameResults(user, getGameNum());
	return { gameResults: results };
};
