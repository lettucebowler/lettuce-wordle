import { getUserProfile } from '$lib/client/github';
import { getGameResults, saveGameResults, upsertUser } from '$lib/util/gameresults';

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.params.user;
	// let userProfile = await getUserProfile(event, user);
	const results = await getGameResults(user, 50, event.locals.dbProvider);

	let userProfile;
	try {
		userProfile = await getUserProfile(event, user);
	} catch (e) {
		userProfile = {
			login: 'OOPSIE',
			bio: 'I decided to use my enterprise account and broke the github user api',
			image: 'https://avatars.githubusercontent.com/u/31812953?v=4',
			id: 0,
			email: 'no@email.com'
		};
	}
	// const userProfile = {
	// 	login: user,
	// 	id: first.user_id,
	// 	email: '',
	// 	image: `https://avatars.githubusercontent.com/u/${first.user_id}?v=4`
	// };
	// for (const result of results) {
	// 	await saveGameResults(result, 'd1');
	// }
	// await upsertUser({
	// 	username: userProfile.login,
	// 	github_id: userProfile?.id || 0
	// }, 'all');
	return {
		gameResults: results,
		userProfile
	};
};
