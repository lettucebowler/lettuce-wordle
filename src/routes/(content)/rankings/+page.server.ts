import { getGameNum } from '$lib/util/share';
import { getLeaderBoardResults } from '$lib/util/gameresults';

export const load: import('./$types').PageServerLoad = async (event) => {
	const dbProvider = event.locals.dbProvider;
	const scores = await getLeaderBoardResults(getGameNum(), dbProvider);
	return {
		scores
	};
};
