import { getGameResults } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';
import { fetcher } from 'itty-fetcher';

const userInfo = fetcher({
	base: 'https://api.github.com/users'
});

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.params.user;
	const userProfile = await userInfo.get(`/${user}`);
	const results = await getGameResults(user, getGameNum());
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { login, bio, avatar_url } = userProfile;
	return {
		gameResults: results,
		userProfile: {
			login,
			bio,
			avatar: avatar_url
		}
	};
};
