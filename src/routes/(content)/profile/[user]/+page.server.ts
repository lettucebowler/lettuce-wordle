import type { Config } from '@sveltejs/adapter-vercel';
export const config: Config = {
	regions: ['iad1']
};

import { getGameResults } from '$lib/util/gameresults';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const user = event.params.user;
	return {
		gameResults: getGameResults(user, 1400, event.locals.dbProvider),
		user
	};
};
