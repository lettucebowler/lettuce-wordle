import { getGameResults, saveGameResults, upsertUser } from '$lib/util/gameresults';

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.params.user;
	// let userProfile = await getUserProfile(event, user);
	const results = await getGameResults(user, 50, event.locals.dbProvider);
	const [first] = results;
	const userProfile = {
		login: user,
		id: first.user_id,
		email: '',
		image: `https://avatars.githubusercontent.com/u/${first.user_id}?v=4`
	};
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
