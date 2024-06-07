import * as v from 'valibot';
import { getGameNum, isAllowedGuess } from '$lib/util/words';

function allowedGuess() {
	return v.custom<string>((value) => isAllowedGuess({ guess: value }), 'Not on allowed guess list');
}

export const guessWordSchema = v.string([v.minLength(5), v.maxLength(5), allowedGuess()]);

export const GameNumSchema = v.optional(v.number([v.integer(), v.minValue(1)]), getGameNum);

export const GameStateSchema = v.object({
	gameNum: GameNumSchema,
	guesses: v.array(guessWordSchema),
	currentGuess: v.string()
});

export type GameState = v.Output<typeof GameStateSchema>;

export const guessKeySchema = v.picklist([
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'enter',
	'backspace'
]);

export type GuessKey = v.Output<typeof guessKeySchema>;

export const gameResultSchema = v.object({
	gameNum: GameNumSchema,
	answers: v.string()
});

export type GameResult = v.Output<typeof gameResultSchema>;
