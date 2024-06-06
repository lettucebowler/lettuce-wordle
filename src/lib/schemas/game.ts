import * as v from 'valibot';
import { getGameNum, isAllowedGuess } from '$lib/util/words';

function allowedGuess() {
	return v.custom<string>((value) => isAllowedGuess({ guess: value }), 'Not on allowed guess list');
}

const GuessWordSchema = v.string([v.minLength(5), v.maxLength(5), allowedGuess()]);

export const GameNumSchema = v.optional(v.number([v.integer(), v.minValue(1)]), getGameNum);

export const GameStateSchema = v.object({
	gameNum: GameNumSchema,
	guesses: v.array(GuessWordSchema),
	currentGuess: v.string()
});

export type GameState = v.Output<typeof GameStateSchema>;
