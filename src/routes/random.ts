import { getRandomWord } from '../util/words';

export async function get() {
	const answer = getRandomWord();
	return {
		body: { answer }
	};
}
