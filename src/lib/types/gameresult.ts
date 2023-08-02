import {
	string,
	maxLength,
	toLowerCase,
	regex,
	number,
	minValue,
	array,
	optional,
	type Output,
	object,
	minLength,
	custom,
	boolean
} from 'valibot';

import { answerList, allowedGuesses } from '$lib/util/words';
function allowedGuess() {
	return custom(
		(value: string) => answerList.includes(value) || allowedGuesses.includes(value),
		'Guess not in list of allowed guesses.'
	);
}
export const GuessSchema = object({
	guess: string([minLength(5), maxLength(5), allowedGuess()]),
	complete: boolean()
});
export type Guess = Output<typeof GuessSchema>;

export function integer() {
	return custom((value: number) => Number.isInteger(value), 'Value must be integer.');
}
function gameNum() {
	return number([integer(), minValue(1)]);
}
export const GameStateSchema = object({
	gameNum: gameNum(),
	guesses: array(GuessSchema)
});
export type GameState = Output<typeof GameStateSchema>;

export type LeaderboardResults = {
	user: string;
	userId: number;
	sum: number;
	count: number;
	score: number;
};

const answerSchema = string([regex(/[xci_]/)]);
export const GameResultSchema = object({
	user: optional(string()),
	user_id: number([integer(), minValue(1)]),
	gamenum: gameNum(),
	answers: answerSchema
});
export type GameResult = Output<typeof GameResultSchema>;
