import { getDailyWord } from '$lib/util/words';

export async function get() {
	const answer = getDailyWord();
	return {
		body: { answer }
	};
}
