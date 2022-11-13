import { getInfoForLeaderBoard } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';

export const load: import('./$types').PageServerLoad = async () => {
	const scores = await getInfoForLeaderBoard(getGameNum());
	return {
		scores
	};
};
