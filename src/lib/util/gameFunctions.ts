import { successAnswer } from '$lib/constants/app-constants';
import { guessKeySchema, type GameState } from '$lib/schemas/game';
import { getDailyWord, getGameNum, getGameWord, isAllowedGuess } from './words';
import * as v from 'valibot';

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

export function checkWordsV2({
	guesses,
	gameNum = getGameNum()
}: {
	guesses: Array<string>;
	gameNum?: number;
}) {
	const answer = getGameWord(gameNum);
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

type ApplyResult =
	| {
			error: {
				message: string;
			};
			gameState?: undefined;
	  }
	| {
			error?: undefined;
			gameState: GameState;
	  };

export function applyKey({ gameState, key }: { gameState: GameState; key: string }): ApplyResult {
	const lastGuess = gameState.guesses.at(0) ?? '';
	if (checkWord({ guess: lastGuess }) === successAnswer) {
		return {
			gameState
		};
	}
	const keyParseResult = v.safeParse(guessKeySchema, key);
	if (!keyParseResult.success) {
		return {
			error: {
				message: 'Invalid key'
			}
		};
	}
	if (keyParseResult.output === 'enter') {
		return {
			gameState
		};
	}
	if (keyParseResult.output === 'backspace') {
		return {
			gameState: {
				...gameState,
				currentGuess: gameState.currentGuess.slice(0, -1)
			}
		};
	}
	return {
		gameState: {
			...gameState,
			currentGuess: `${gameState.currentGuess}${keyParseResult.output}`.slice(0, 5)
		}
	};
}

export function applyWord({
	gameState,
	guess
}: {
	gameState: GameState;
	guess: string;
}): ApplyResult {
	const lastGuess = gameState.guesses.at(-1) ?? '';
	if (checkWord({ guess: lastGuess }) === successAnswer) {
		return {
			gameState
		};
	}
	if (!isAllowedGuess({ guess })) {
		return {
			error: {
				message: 'Invalid word'
			}
		};
	}
	return {
		gameState: {
			gameNum: gameState.gameNum,
			currentGuess: '',
			guesses: [...gameState.guesses, guess]
		}
	};
}
