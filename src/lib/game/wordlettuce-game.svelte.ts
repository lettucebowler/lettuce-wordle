import { getGameNum } from '$lib/util/words';
import * as v from 'valibot';
import { successAnswer } from '$lib/constants/app-constants';
import { isAllowedGuess } from '$lib/util/words';
import { checkWordsV2 } from '$lib/util/gameFunctions';
import { GuessLetter } from '$lib/schemas/game';

type WordlettuceGameConstructorArgs = {
	gameNum?: number;
	currentGuess?: string;
	guesses?: Array<string>;
};

export class WordlettuceGame {
	gameNum: number = $state(1);
	guesses: Array<string> = $state([]);
	answers: Array<string> = $derived.by(() =>
		checkWordsV2({ guesses: this.guesses, gameNum: this.gameNum })
	);
	// answers: Array<string> = $state([]);
	success: boolean = $derived.by(() => {
		return this.answers.at(-1) === successAnswer;
	});
	// success: boolean = $state(false);
	currentGuess: string = $state('');

	constructor({
		gameNum = getGameNum(),
		guesses = [],
		currentGuess = ''
	}: WordlettuceGameConstructorArgs = {}) {
		this.gameNum = gameNum;
		this.currentGuess = currentGuess;
		if (guesses) {
			this.guesses = guesses;
		}
		// const answers = checkWordsV2({ guesses: guesses, gameNum: gameNum });
		// this.answers = answers;
		// this.success = answers.at(-1) === successAnswer;
	}

	static fromStateString = (state: string) => {
		if (!state) {
			return new WordlettuceGame();
		}
		const decoded = atob(state);
		const [gameNum, guesses, currentGuess] = decoded.split(';');
		if (!gameNum || Number(gameNum) !== getGameNum()) {
			return new WordlettuceGame();
		}
		return new WordlettuceGame({
			gameNum: gameNum ? Number(gameNum) : getGameNum(),
			guesses: guesses.length ? guesses.split(',') : [],
			currentGuess
		});
	};

	toStateString = () => {
		return btoa(`${this.gameNum};${this.guesses.join(',')};${this.currentGuess}`);
	};

	doReset = () => {
		this.gameNum = getGameNum();
		// this.answers = [];
		this.guesses = [];
		// this.success = false;
		this.currentGuess = '';
	};

	doLetter = (letter: GuessLetter) => {
		if (this.success || this.currentGuess.length >= 5) {
			return {};
		}
		const letterParseResult = v.safeParse(GuessLetter, letter);
		if (!letterParseResult.success) {
			return {
				error: {
					message: 'Invalid key'
				}
			};
		}
		this.currentGuess += letterParseResult.output;
		return {};
	};

	doUndo = () => {
		this.currentGuess = this.currentGuess.slice(0, -1);
	};

	doSumbit = () => {
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
		this.guesses = Array.from([...this.guesses, this.currentGuess]);
		this.currentGuess = '';
		// this.answers = checkWordsV2({ guesses: this.guesses, gameNum: this.gameNum });
		// this.success = this.answers.at(-1) === successAnswer;
		return {};
	};
}
