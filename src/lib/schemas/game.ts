import * as v from 'valibot';
import { getGameNum, isAllowedGuess } from '$lib/util/words';
import { PositiveIntegerSchema } from './util';

export const GuessWordSchema = v.pipe(
	v.string(),
	v.check((input) => isAllowedGuess({ guess: input }))
);

export const GameNumSchema = v.optional(PositiveIntegerSchema, getGameNum);

export const GameStateSchema = v.object({
	gameNum: GameNumSchema,
	guesses: v.array(GuessWordSchema),
	currentGuess: v.string()
});

export type GameState = v.InferOutput<typeof GameStateSchema>;

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

export type GuessKey = v.InferOutput<typeof guessKeySchema>;
