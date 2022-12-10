import { getGameResults } from '$lib/client/apiWordlettuce';
import { fetcher } from 'itty-fetcher';

const userInfo = fetcher({
	base: 'https://api.github.com/users'
});

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.params.user;
	let userProfile;
	try {
		userProfile = await userInfo.get(`/${user}`);
	} catch (e) {
		userProfile = {
			login: 'OOPSIE',
			bio: 'I decided to use my enterprise account and broke the github user api',
			avatar_url: 'https://avatars.githubusercontent.com/u/31812953?v=4'
		};
	}
	const results = await getGameResults(user, 30);
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
