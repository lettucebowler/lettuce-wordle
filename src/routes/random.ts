import { getRandomWord } from '$lib/words';

export async function get() {
	const answer = getRandomWord();
	return {
		body: { answer }
	};
}
