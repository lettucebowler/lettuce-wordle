import { getGameResults } from '$lib/client/planetscale';
import { getGameNum } from '$lib/util/share';
import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		throw redirect(307, '/login');
	}

	const results = await getGameResults(user.login, getGameNum());
	console.log(results);
	// const cookie = cookies.get('wordLettuceState') || '';
	// let gameState = decodeState(cookie);
	// const dailyWord = getDailyWord();
	// const isStateForToday = gameState?.answer === dailyWord;
	// if (!isStateForToday) {
	// 	gameState = {
	// 		answer: dailyWord,
	// 		guesses: [],
	// 		answers: []
	// 	};
	// }

	// cookies.set('wordLettuceState', encodeState(gameState), {
	// 	httpOnly: false,
	// 	path: '/',
	// 	maxAge: 86400,
	// 	secure: false
	// });

	// return {
	// 	state: gameState
	// };
	return results;
};
