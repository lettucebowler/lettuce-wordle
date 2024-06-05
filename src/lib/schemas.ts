import * as v from 'valibot';
import { isAllowedGuess } from './util/words';

const GuessWordSchema = v.string([
	v.minLength(5),
	v.maxLength(5),
	v.custom(
		(value: string) => isAllowedGuess({ guess: value }),
		'Guess not in list of allowed guesses.'
	)
]);

const IncompleteGuessSchema = v.object({
	guess: GuessWordSchema,
	complete: v.literal(false)
});

const CompleteGuessSchema = v.object({
	guess: GuessWordSchema,
	complete: v.literal(true)
});

export const GuessSchema = v.union([CompleteGuessSchema, IncompleteGuessSchema]);
export type Guess = v.Output<typeof GuessSchema>;
