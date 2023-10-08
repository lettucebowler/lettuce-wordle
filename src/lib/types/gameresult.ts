import {
	string,
	maxLength,
	regex,
	number,
	minValue,
	array,
	optional,
	type Output,
	object,
	minLength,
	custom,
	union,
	integer,
	literal,
	nullType,
	voidType,
	getDefault
} from 'valibot';

import { answerList, allowedGuesses } from '$lib/util/words';
import { getGameNum } from '$lib/util/share';
function allowedGuess() {
	return custom(
		(value: string) => answerList.includes(value) || allowedGuesses.includes(value),
		'Guess not in list of allowed guesses.'
	);
}
export const completeGuessSchema = object({
	guess: string([minLength(5), maxLength(5), allowedGuess()]),
	complete: literal(true)
});
export type CompleteGuess = Output<typeof completeGuessSchema>;
export const incompleteGuessSchema = object({
	guess: string(),
	complete: literal(false)
});
export type IncompleteGuess = Output<typeof incompleteGuessSchema>;
export const guessSchema = union([completeGuessSchema, incompleteGuessSchema]);
export type Guess = Output<typeof guessSchema>;
export function isCompleteGuess(guess: Guess): guess is CompleteGuess {
	return guess.complete;
}

const gameNumSchema = optional(number([integer(), minValue(1)]), getGameNum);
export const gameStateSchema = object({
	gameNum: gameNumSchema,
	guesses: array(guessSchema)
});
export type GameState = Output<typeof gameStateSchema>;

export const leaderboardResultSchema = object({
	user: string(),
	games: number([integer(), minValue(0)]),
	score: number([integer(), minValue(0)])
});
export type LeaderboardResult = Output<typeof leaderboardResultSchema>;

const answerSchema = string([
	regex(/[xci_]/),
	custom((input) => input.length % 5 === 0, 'answers must be multiple of 5 characters')
]);
export const gameResultSchema = object({
	gameNum: gameNumSchema,
	answers: answerSchema
});
export type GameResult = Output<typeof gameResultSchema>;
