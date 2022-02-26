import { getDailyWord } from '$lib/words';

export async function get() {
	const answer = getDailyWord();
	return {
		body: { answer }
	};
}
