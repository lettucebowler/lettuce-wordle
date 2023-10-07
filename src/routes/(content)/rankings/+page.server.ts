// import { getGameNum } from '$lib/util/share';
import { getLeaderBoardResults } from '$lib/util/gameresults';
export async function load(event) {
	const dbProvider = event.locals.getDbProvider();
	const leaderboardResults = await getLeaderBoardResults(dbProvider);

	return {
		leaderboard: {
			scores: leaderboardResults
		}
	};
}
