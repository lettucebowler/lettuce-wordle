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

export const GameHotKey = v.picklist(['enter', 'backspace']);

export type GameHotKey = v.InferOutput<typeof GameHotKey>;

export const GuessLetter = v.picklist([
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
	'z'
]);

export type GuessLetter = v.InferOutput<typeof GuessLetter>;

export const GameKey = v.union([GuessLetter, GameHotKey]);

export type GuessKey = v.InferOutput<typeof GameKey>;
