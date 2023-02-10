import type { Config } from '@sveltejs/adapter-vercel';
export const config: Config = {
	regions: ['iad1']
};

import { getGameNum } from '$lib/util/share';
import { getLeaderBoardResults } from '$lib/util/gameresults';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const dbProvider = event.locals.dbProvider;
	const scores = await getLeaderBoardResults(getGameNum(), dbProvider);
	return {
		scores
	};
};
