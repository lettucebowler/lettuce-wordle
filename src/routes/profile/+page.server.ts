import { getGameResults } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';
import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw redirect(307, '/login');
	}

	const results = await getGameResults(user.login, getGameNum());
	return { gameResults: results };
};
