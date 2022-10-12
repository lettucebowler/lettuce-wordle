import { getInfoForLeaderBoard } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';

export const load: import('./$types').PageServerLoad = async ({ cookies, depends, locals }) => {
	const scores = await getInfoForLeaderBoard(getGameNum());
	return {
		scores
	};
};
