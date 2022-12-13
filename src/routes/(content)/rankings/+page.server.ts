import { getLeaderBoardResults } from '$lib/client/apiWordlettuce';
import { getInfoForLeaderBoard } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';

export const load: import('./$types').PageServerLoad = async (event) => {
	const dbProvider = event.locals.dbProvider;
	const scores =
		dbProvider === 'cf'
			? await getLeaderBoardResults(getGameNum())
			: await getInfoForLeaderBoard(getGameNum());
	return {
		scores
	};
};
