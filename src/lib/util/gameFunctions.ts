import {
	CompleteGuessSchema,
	type CompleteGuessOutput,
	type GuessOutput,
	type IncompleteGuess
} from '$lib/types/gameresult';
import { getDailyWord } from './words';

export function checkWord({ guess, answer }: { guess: string; answer: string }) {
	if (!guess.length) {
		return '_____';
	}
	const guessLetters = guess.split('').map((l) => l.toLowerCase());
	const answerLetters = answer.split('').map((l) => l.toLowerCase());
	return guessLetters
		.map((guessLetter, index) => {
			if (answerLetters.at(index) === guessLetter) {
				return 'x';
			}
			const letterPosition = guess
				.split('')
				.slice(0, index)
				.filter((l) => l === guessLetter).length;
			const answerLetterCount = answerLetters.filter((l) => l === guessLetter).length;
			if (answerLetterCount > 0 && letterPosition < answerLetterCount) {
				return 'c';
			}
			return 'i';
		})
		.join('');
}

export const checkWords = (guesses: { guess: string; complete: boolean }[], answer: string) => {
	return guesses
		.filter((guess) => guess?.guess?.length === 5 && guess?.complete)
		.map((guess) => {
			return checkWord({ guess: guess.guess, answer });
		});
};

export const getKeyStatuses = (
	words: {
		guess: string;
		complete: boolean;
	}[],
	statuses: string[]
) => {
	if (!words || !statuses) {
		return {};
	}
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

export const applyKey = (key: string, guesses: GuessOutput[], answers: string[]) => {
	if (answers?.at(-1) === 'xxxxx') {
		return guesses;
	}
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

import * as v from 'valibot';
import { GuessSchema } from './words';
import { successAnswer } from '$lib/constants/app-constants';
export const applyWord = (
	guesses: CompleteGuessOutput[],
	guess: IncompleteGuess,
	answers: string[]
): {
	updatedGuesses: GuessOutput[];
	metadata: { invalid: boolean; success: boolean };
	updatedAnswers: string[];
} => {
	const metadata = {
		invalid: false,
		success: false,
		message: ''
	};
	const parseGuessesResult = v.safeParse(v.array(CompleteGuessSchema), guesses);
	if (!parseGuessesResult.success) {
		metadata.invalid = true;
		return {
			updatedGuesses: guesses,
			metadata,
			updatedAnswers: answers
		};
	}
	const answer = getDailyWord();
	if (answers.at(-1) === 'xxxxx') {
		metadata.success = true;
		return {
			updatedGuesses: guesses,
			metadata,
			updatedAnswers: answers
		};
	}
	const guessParseResult = v.safeParse(GuessSchema, guess);
	if (!guessParseResult.success) {
		return {
			updatedGuesses: guesses,
			metadata: {
				...metadata,
				invalid: true
			},
			updatedAnswers: answers
		};
	}
	answers.push(checkWord({ guess: guessParseResult.output.guess, answer }));
	return {
		updatedGuesses: [...guesses, { guess: guessParseResult.output.guess, complete: true }],
		metadata: {
			invalid: false,
			success: answers.at(-1) === successAnswer
		},
		updatedAnswers: answers
	};
};
