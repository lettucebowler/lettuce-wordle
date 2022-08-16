import { getDailyWord } from '$lib/util/words';

export async function load({ locals }) {
	const { state } = locals;
	const dailyword = getDailyWord();
	const words = state.answer === dailyword ? state.words : ['', '', '', '', '', ''];
	return {
		state: {
			answer: dailyword,
			words,
			success: words.filter(Boolean).at(-1) === dailyword,
			attempt: words.filter(Boolean).length || 0
		}
	};
}
