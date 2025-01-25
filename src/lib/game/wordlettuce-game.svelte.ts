import { getGameNum } from '$lib/util/words';
import * as v from 'valibot';
import { successAnswer } from '$lib/constants/app-constants';
import { isAllowedGuess } from '$lib/util/words';
import { checkWordsV2 } from '$lib/util/gameFunctions';

export class WordlettuceGame {
	gameNum: number = $state(1);
	guesses: Array<string> = $state([]);
	answers: Array<string> = $derived.by(() => {
		return checkWordsV2({ guesses: this.guesses, gameNum: this.gameNum });
	});
	success: boolean = $derived.by(() => {
		return this.answers.at(-1) === successAnswer;
	});
	currentGuess: string = $state('');

	constructor({
		gameNum = getGameNum(),
		guesses = [],
		currentGuess = ''
	}: {
		gameNum?: number;
		currentGuess?: string;
		guesses?: Array<string>;
	} = {}) {
		this.gameNum = gameNum;
		this.currentGuess = currentGuess;
		if (guesses) {
			this.guesses = guesses;
		}
	}

	reset = () => {
		this.gameNum = getGameNum();
		this.answers = [];
		this.guesses = [];
		this.success = false;
		this.currentGuess = '';
	};

	letter = (letter: GuessLetter) => {
		if (this.success || this.currentGuess.length >= 5) {
			return;
		}
		const letterParseResult = v.safeParse(guessLetterSchema, letter);
		if (!letterParseResult.success) {
			return {
				error: {
					message: 'Invalid key'
				}
			};
		}

		this.currentGuess += letterParseResult.output;
	};

	undo = () => {
		this.currentGuess = this.currentGuess.slice(0, -1);
	};

	submit = () => {
		if (this.success) {
			return {};
		}
		if (!isAllowedGuess({ guess: this.currentGuess })) {
			return {
				error: {
					message: 'Invalid word'
				}
			};
		}
		this.guesses.push(this.currentGuess);
		this.currentGuess = '';
		return {};
	};
}

export const guessLetterSchema = v.picklist([
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

type GuessLetter = v.InferOutput<typeof guessLetterSchema>;
