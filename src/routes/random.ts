import { getRandomWord } from '$lib/util/words';

export async function get() {
	const answer = getRandomWord();
	return {
		body: { answer }
	};
}
