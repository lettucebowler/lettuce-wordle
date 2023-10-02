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
	voidType
} from 'valibot';

import { answerList, allowedGuesses } from '$lib/util/words';
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

const gameNumSchema = number([integer(), minValue(1)]);
export const gameStateSchema = object({
	gameNum: gameNumSchema,
	guesses: array(guessSchema)
});
export type GameState = Output<typeof gameStateSchema>;

export const leaderboardResultSchema = object({
	user: string(),
	userId: number([integer(), minValue(0)]),
	sum: number([integer(), minValue(0)]),
	count: number([integer(), minValue(0)]),
	score: number([integer(), minValue(0)])
});
export type LeaderboardResult = Output<typeof leaderboardResultSchema>;

const answerSchema = string([regex(/[xci_]/)]);
export const gameResultSchema = object({
	user: optional(string()),
	user_id: optional(number([integer(), minValue(1)])),
	gamenum: gameNumSchema,
	answers: answerSchema,
	attempts: optional(number([integer()]))
});
export type GameResult = Output<typeof gameResultSchema>;
