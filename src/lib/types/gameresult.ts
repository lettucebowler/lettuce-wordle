import * as v from 'valibot';

import { answerList, allowedGuesses } from '$lib/util/words';
import { getGameNum } from '$lib/util/words';

export const AllowedWordSchema = v.picklist([...answerList, ...allowedGuesses]);
export type AllowedWordInput = v.Input<typeof AllowedWordSchema>;
export type AllowedWordOutput = v.Output<typeof AllowedWordSchema>;

export const CompleteGuessSchema = v.object({
	guess: AllowedWordSchema,
	complete: v.literal(true)
});
export type CompleteGuessOutput = v.Output<typeof CompleteGuessSchema>;
export const IncompleteGuessSchema = v.object({
	guess: v.string(),
	complete: v.literal(false)
});
export type IncompleteGuess = v.Output<typeof IncompleteGuessSchema>;
export const GuessSchema = v.union([CompleteGuessSchema, IncompleteGuessSchema]);
export type GuessOutput = v.Output<typeof GuessSchema>;
export function isCompleteGuess(guess: GuessOutput): guess is CompleteGuessOutput {
	return guess.complete;
}

const GameNumSchema = v.optional(v.number([v.integer(), v.minValue(1)]), getGameNum);
export const GameStateSchema = v.object({
	gameNum: GameNumSchema,
	guesses: v.array(GuessSchema)
});
export type GameStateOutput = v.Output<typeof GameStateSchema>;

export const LeaderboardResultSchema = v.object({
	user: v.string(),
	games: v.number([v.integer(), v.minValue(0)]),
	score: v.number([v.integer(), v.minValue(0)])
});
export type LeaderboardResultOutput = v.Output<typeof LeaderboardResultSchema>;

const letterStatuses: ReadonlyArray<string> = ['x', 'c', 'i', '_'];
export const LetterStatusSchema = v.picklist(letterStatuses);
export type LetterStatusOutput = v.Output<typeof LetterStatusSchema>;

export const AnswerStringSchema = v.string([
	v.custom(
		(input) => input.split('').every((status) => letterStatuses.includes(status)),
		'answer must only contain letter statuses'
	),
	v.custom((input) => input.length % 5 === 0, 'answers must be multiple of 5 characters')
]);
export type AnswerStringOutput = v.Output<typeof AnswerStringSchema>;
export const gameResultSchema = v.object({
	gameNum: GameNumSchema,
	answers: AnswerStringSchema
});
export type GameResultOutput = v.Output<typeof gameResultSchema>;
