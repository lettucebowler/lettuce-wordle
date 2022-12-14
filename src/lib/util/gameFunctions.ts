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

export const checkWords = (guesses: { guess: string; complete: boolean }[], answer: string) => {
	return guesses
		.filter((guess) => guess?.guess?.length === 5 && guess?.complete)
		.map((guess) => {
			return checkWord(guess.guess.split(''), answer);
		});
};

export const getKeyStatuses = (
	words: {
		guess: string;
		complete: boolean;
	}[],
	statuses: string[]
) => {
	const letters = Array.from(
		new Set(
			words
				.map((w, i) =>
					w.guess.split('').map((l, j) => ({
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

export const applyKey = (
	key: string,
	guesses: {
		guess: string;
		complete: boolean;
	}[],
	answers: string[]
) => {
	const keyTest = /^[a-zA-Z]{1}$/;
	const isLetter = keyTest.test(key);
	const current_guess = answers.length;
	const guess = guesses.at(current_guess) || {
		guess: '',
		complete: false
	};
	if (
		(!isLetter && key.toLowerCase() !== 'backspace') ||
		(key.toLowerCase() === 'backspace' && guess.guess.length === 0) ||
		(isLetter && guess.guess.length >= 5)
	) {
		return guesses;
	}

	const updatedGuesses = guesses;
	if (key.toLowerCase() === 'backspace') {
		updatedGuesses[current_guess] = {
			guess: updatedGuesses[current_guess]?.guess?.slice(0, -1),
			complete: false
		};
	} else {
		updatedGuesses[current_guess] = {
			guess: (updatedGuesses[current_guess]?.guess || '') + key.toLowerCase(),
			complete: false
		};
	}
	return updatedGuesses;
};

export const applyWord = (
	guesses: {
		guess: string;
		complete: boolean;
	}[],
	data: string[],
	answers: string[]
) => {
	const answer = getDailyWord();
	const guessLetters = data.map((l: string) => l.toLowerCase());
	const guess = guessLetters.join('');
	const metadata = {
		invalid: false,
		success: false
	};
	if (answers.at(-1) === 'xxxxx') {
		metadata.success = true;
		return {
			updatedGuesses: guesses,
			metadata,
			updatedAnswers: answers
		};
	}
	if (guess.length !== 5 || !isValidWord(guess) || !guesses.length) {
		metadata.invalid = true;
		return {
			updatedGuesses: guesses,
			metadata,
			updatedAnswers: answers
		};
	}
	const statuses = checkWord(guessLetters, answer);
	let updatedGuesses = guesses.map((guess) => {
		return {
			guess: guess.guess,
			complete: guess.guess.length === 5,
		}
	})
	answers.push(statuses);

	if (statuses === 'xxxxx') {
		metadata.success = true;
	}

	return {
		updatedGuesses,
		metadata,
		answers
	};
};
