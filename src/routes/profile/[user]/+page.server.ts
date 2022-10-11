import { getGameResults } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';
import { fetcher } from 'itty-fetcher';

const userInfo = fetcher({
	base: 'https://api.github.com/users'
});

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.params.user;
	const userProfile = await userInfo.get(`/${user}`);
	if (userProfile.login === 'epatts') {
		userProfile.bio = 'bad at wordle';
		return {
			gameResults: [],
			userProfile
		};
	} else if (userProfile.login === 'daniellelecocq') {
		userProfile.bio = 'abandoner';
	}
	const results = await getGameResults(user, getGameNum());
	return { gameResults: results, userProfile };
};
