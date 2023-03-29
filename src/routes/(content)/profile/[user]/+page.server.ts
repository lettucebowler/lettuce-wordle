// import type { Config } from '@sveltejs/adapter-vercel';
// export const config: Config = {
// 	regions: ['iad1'],
// 	runtime: 'edge'
// };

import { getGameResults } from '$lib/util/gameresults';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const user = event.params.user;
	const gameResults = getGameResults(user, 30, event.locals.dbProvider);
	return {
		profile: {
			gameResults: await gameResults,
			user
		}
	};
};
