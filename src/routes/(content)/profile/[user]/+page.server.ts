import type { Config } from '@sveltejs/adapter-vercel';
export const config: Config = {
	regions: ['cle1']
};

import { getGameResults } from '$lib/util/gameresults';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const user = event.params.user;
	const gameResults = getGameResults(user, 1400, event.locals.dbProvider);
	return {
		profile: {
			gameResults: event.isDataRequest ? gameResults : await gameResults,
			user
		}
	};
};
