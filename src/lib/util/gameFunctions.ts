import { getDailyWord, isValidWord } from './words';

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

export const applyKey = (key: string, guesses: string[], answers: string[]) => {
	if (answers.at(-1) === 'xxxxx') {
		return guesses;
	}
	const keyTest = /^[a-zA-Z]{1}$/;
	const isLetter = keyTest.test(key);
	const current_guess = answers.length;
	const guess = guesses.at(current_guess) || '';
	if (
		(!isLetter && key.toLowerCase() !== 'backspace') ||
		(key.toLowerCase() === 'backspace' && guess.length === 0) ||
		(isLetter && guess.length >= 5)
	) {
		return guesses;
	}

	const updatedGuesses = guesses;
	if (key.toLowerCase() === 'backspace') {
		updatedGuesses[current_guess] = updatedGuesses[current_guess].slice(0, -1);
	} else {
		updatedGuesses[current_guess] = guess + key.toLowerCase();
	}
	return updatedGuesses;
};

export const applyWord = (
	game: {
		guesses: string[];
		answers: string[];
	},
	data: string[]
) => {
	const answer = getDailyWord();
	const guessLetters = data.map((l: string) => l.toLowerCase());
	const guess = guessLetters.join('');
	const metadata = {
		invalid: false,
		success: false
	};
	let updatedGame = game;
	if (updatedGame.answers.at(-1) === 'xxxxx') {
		return {
			updatedGame,
			metadata
		};
	}
	if (guess.length !== 5 || !isValidWord(guess)) {
		metadata.invalid = true;
		return {
			updatedGame,
			metadata
		};
	}
	const statuses = checkWord(guessLetters, answer);
	const updatedAnswers = [...(game.answers || []), statuses];
	const updatedGuesses = game?.guesses || [];
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
