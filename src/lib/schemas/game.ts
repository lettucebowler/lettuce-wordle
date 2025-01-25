import * as v from 'valibot';
import { getGameNum, isAllowedGuess } from '$lib/util/words';
import { PositiveIntegerSchema } from './util';
import { guessLetterSchema } from '$lib/game/wordlettuce-game.svelte';

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

export const guessKeySchema = v.union([guessLetterSchema, v.picklist(['enter', 'backspace'])]);

export type GuessKey = v.InferOutput<typeof guessKeySchema>;
