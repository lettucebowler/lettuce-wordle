import * as v from 'valibot';

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

export const LetterStatus = v.undefinedable(v.picklist(['x', 'c', 'i']));

export type LetterStatus = v.InferOutput<typeof LetterStatus>;
