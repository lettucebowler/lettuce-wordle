// import type { Config } from '@sveltejs/adapter-vercel';
// export const config: Config = {
// 	regions: ['iad1'],
// 	runtime: 'edge'
// };

import { getGameNum } from '$lib/util/share';
import { getLeaderBoardResults } from '$lib/util/gameresults';
export async function load(event) {
	const dbProvider = event.locals.dbProvider;
	const leaderboardResults = await getLeaderBoardResults(getGameNum(), dbProvider);

	return {
		leaderboard: {
			scores: leaderboardResults
		}
	};
}
