import { getLeaderBoardResults } from '$lib/client/apiWordlettuce';
import { getGameNum } from '$lib/util/share';

export const load: import('./$types').PageServerLoad = async () => {
	const scores = await getLeaderBoardResults(getGameNum());
	return {
		scores
	};
};
