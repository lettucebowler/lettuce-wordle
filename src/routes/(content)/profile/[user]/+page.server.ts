import { getGameResults } from '$lib/util/gameresults';
import { getUserProfile } from '$lib/client/github';

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.params.user;
	let userProfile;
	try {
		userProfile = await getUserProfile(event, user);
	} catch (e) {
		userProfile = {
			login: 'OOPSIE',
			bio: 'I decided to use my enterprise account and broke the github user api',
			avatar: 'https://avatars.githubusercontent.com/u/31812953?v=4'
		};
	}
	const results = await getGameResults(user, 30, event.locals.dbProvider);
	return {
		gameResults: results,
		userProfile
	};
};
