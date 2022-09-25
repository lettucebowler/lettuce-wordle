import { isValidWord } from './words';

const getLetterLocations = (s: string, l: string) => {
	return s
		.split('')
		.map((l: string, i: number) => ({ letter: l, index: i }))
		.filter((slot) => slot.letter === l)
		.map((slot) => slot.index);
};

const containsLetter = (letter: string, index: number, guess: string, answer: string) => {
	const guessLocations = getLetterLocations(guess, letter);
	const answerLocations = getLetterLocations(answer, letter);
	const correctCount = guessLocations.filter((location) =>
		answerLocations.includes(location)
	).length;
	const previousContainsCount = getLetterLocations(guess.slice(0, index), letter).filter(
		(index) => !answerLocations.includes(index)
	).length;
	return correctCount + previousContainsCount < answerLocations.length;
};

export const checkWord = (word: string[], answer: string) => {
	// _ => none
	// x => correct
	// c => contains
	// i => incorrect
	if (!word) {
		return '_____';
	}

	const contains = word.map((char, i) =>
		containsLetter(char, i, word.join(''), answer) ? 'c' : 'i'
	);
	const correct = word.map((char, i) => (answer[i] === char ? 'x' : ''));

	const statuses = correct.map((status, i) => (status ? status : contains[i]));
	return statuses.join('');
};

export const getKeyStatuses = (words: string[], statuses: string[]) => {
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

export const applyWord = (
	game: {
		answer: string;
		guesses: string[];
		answers: string[];
	},
	data: string[]
) => {
	const guessLetters = data.map((l: string) => l.toLowerCase());
	const guess = guessLetters.join('');
	const metadata = {
		invalid: false,
		success: false
	};
	let updatedGame = game;
	if (guess.length !== 5 || !isValidWord(guess)) {
		metadata.invalid = true;
		return {
			updatedGame: game,
			metadata
		};
	}
	const statuses = checkWord(guessLetters, game?.answer);
	const updatedAnswers = [...(game.answers || []), statuses];
	let updatedGuesses = game?.guesses || [];
	if (game?.guesses?.length < updatedAnswers.length) {
		updatedGuesses.push(guess);
	}

	if (statuses === 'xxxxx') {
		metadata.success = true;
	}

	updatedGame = {
		...updatedGame,
		guesses: updatedGuesses,
		answers: updatedAnswers
	};
	return {
		updatedGame,
		metadata
	};
};
