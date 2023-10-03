import { getGameNum } from '$lib/util/share';
import { getLeaderBoardResults } from '$lib/util/gameresults';
export async function load(event) {
	const dbProvider = event.locals.getDbProvider();
	const leaderboardResults = await getLeaderBoardResults(getGameNum(), dbProvider);

	return {
		leaderboard: {
			scores: leaderboardResults
		}
	};
}
