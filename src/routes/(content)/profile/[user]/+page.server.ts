import { getUserProfile } from '$lib/client/github';
import { getGameResults } from '$lib/util/gameresults';

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.params.user;
	return {
		gameResults: getGameResults(user, 1400, event.locals.dbProvider),
		userProfile: getUserProfile(event, user).catch(() => ({
			login: user,
			bio: 'I decided to use my enterprise account and broke the github user api',
			image: 'https://avatars.githubusercontent.com/u/31812953?v=4',
			id: 0,
			email: 'no@email.com'
		}))
	};
};
