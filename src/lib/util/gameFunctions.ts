import { getDailyWord } from './words';

const getLetterLocations = (s: string, l: string) => {
	return s
		.split('')
		.map((l: string, i: number) => ({ letter: l, index: i }))
		.filter((slot) => slot.letter === l)
		.map((slot) => slot.index);
};

function containsLetter({
	index,
	guess,
	answer
}: {
	index: number;
	guess: string;
	answer: string;
}) {
	const letter = guess.charAt(index);
	const guessLocations = getLetterLocations(guess, letter);
	const answerLocations = getLetterLocations(answer, letter);
	const correctCount = guessLocations.filter((location) =>
		answerLocations.includes(location)
	).length;
	const previousContainsCount = getLetterLocations(guess.slice(0, index), letter).filter(
		(index) => !answerLocations.includes(index)
	).length;
	return correctCount + previousContainsCount < answerLocations.length;
}

export function checkWord({ guess, answer = getDailyWord() }: { guess: string; answer?: string }) {
	if (!guess.length) {
		return '_____';
	}
	const contains = guess
		.split('')
		.map((_, i) => (containsLetter({ index: i, guess, answer }) ? 'c' : 'i'));
	const correct = guess.split('').map((char, i) => (answer[i] === char ? 'x' : ''));

	const statuses = correct.map((status, i) => (status ? status : contains[i]));
	return statuses.join('');
}

export function checkWordsV2({ guesses }: { guesses: Array<string> }) {
	const answer = getDailyWord();
	return guesses.map((guess: string) => {
		return checkWord({ guess, answer });
	});
}

export const getKeyStatuses = (words: Array<string>, statuses: string[]) => {
	if (!words || !statuses) {
		return {};
	}
	const letters = Array.from(
		new Set(
			words
				.map((w, i) =>
					w.split('').map((l, j) => ({
						letter: l,
						status: statuses[i]?.[j] || '_'
					}))
				)
				.flat()
		)
	);
	const correctList = letters
		.filter((letter) => letter.status === 'x')
		.map((l) => ({ [l.letter]: l.status }));
	const correct: { [x: string]: string } = Object.assign({}, ...correctList);
	const containsList = letters
		.filter((letter) => letter.status === 'c')
		.map((l) => ({ [l.letter]: l.status }));
	const contains: { [x: string]: string } = Object.assign({}, ...containsList);
	const incorrectList = letters
		.filter((letter) => letter.status === 'i')
		.map((l) => ({ [l.letter]: l.status }));
	const incorrect: { [x: string]: string } = Object.assign({}, ...incorrectList);

	return { ...incorrect, ...contains, ...correct };
};
