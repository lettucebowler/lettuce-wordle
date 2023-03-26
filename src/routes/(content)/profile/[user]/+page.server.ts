import type { Config } from '@sveltejs/adapter-vercel';
export const config: Config = {
	regions: ['iad1'],
	runtime: 'edge'
};

import { getGameResults } from '$lib/util/gameresults';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const showLast = Number(new URL(event.url).searchParams.get('showLast') || '30');
	const user = event.params.user;
	const gameResults = getGameResults(user, showLast, event.locals.dbProvider);
	return {
		showLast,
		profile: {
			gameResults: await gameResults,
			user
		}
	};
};
