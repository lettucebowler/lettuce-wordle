import { getGameNum, getGameWord } from '$lib/util/words';
import { successAnswer } from '$lib/constants/app-constants';
import { isAllowedGuess } from '$lib/util/words';
import { GuessLetter } from '$lib/schemas/game';

type WordlettuceGameConstructorArgs = {
	gameNum?: number;
	currentGuess?: string;
	guesses?: Array<string>;
};

export class WordlettuceGame {
	#gameNum: number = $state(1);
	#guesses: Array<string> = $state([]);
	#currentGuess: string = $state('');
	#answers: Array<string> = $state([]);
	// #success: boolean = $state(false);

	constructor({
		gameNum = getGameNum(),
		guesses = [],
		currentGuess = ''
	}: WordlettuceGameConstructorArgs = {}) {
		this.replaceState({ gameNum, guesses, currentGuess });
	}

	replaceState = ({
		gameNum = getGameNum(),
		guesses = [],
		currentGuess = ''
	}: WordlettuceGameConstructorArgs = {}) => {
		this.#gameNum = gameNum;
		this.#currentGuess = currentGuess;
		if (guesses) {
			this.#guesses = guesses;
			this.#answers = this.#checkWords();
			// this.#success = this.#answers.at(-1) === successAnswer;
		}
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

	get gameNum() {
		return this.#gameNum;
	}

	get currentGuess() {
		return this.#currentGuess;
	}

	get guesses() {
		return this.#guesses;
	}

	get answers() {
		return this.#answers;
	}

	get success() {
		return this.#answers.at(-1) === successAnswer;
		// return this.#success;
	}

	get letterStatuses() {
		if (!this.#guesses.length) {
			return {};
		}
		const letters = Array.from(
			new Set(
				this.#guesses
					.map((w, i) =>
						w.split('').map((l, j) => ({
							letter: l,
							status: this.answers[i]?.[j] || '_'
						}))
					)
					.flat()
			)
		);
		const correctList = letters
			.filter((letter) => letter.status === 'x')
			.map((l) => ({ [l.letter]: l.status }));
		const correct: { [x: string]: string } = Object.assign({}, ...correctList);
		const containsList = letters
			.filter((letter) => letter.status === 'c')
			.map((l) => ({ [l.letter]: l.status }));
		const contains: { [x: string]: string } = Object.assign({}, ...containsList);
		const incorrectList = letters
			.filter((letter) => letter.status === 'i')
			.map((l) => ({ [l.letter]: l.status }));
		const incorrect: { [x: string]: string } = Object.assign({}, ...incorrectList);

		return { ...incorrect, ...contains, ...correct };
	}

	toStateString = () => {
		return btoa(`${this.#gameNum};${this.#guesses.join(',')};${this.#currentGuess}`);
	};

	doLetter = (letter: GuessLetter) => {
		if (this.success || this.#currentGuess.length >= 5) {
			return {};
		}
		this.#currentGuess += letter;
		return {};
	};

	doUndo = () => {
		if (!this.#currentGuess.length) {
			return;
		}
		this.#currentGuess = this.#currentGuess.slice(0, -1);
	};

	doSumbit = () => {
		if (this.success) {
			return {};
		}
		if (!isAllowedGuess({ guess: this.#currentGuess })) {
			return {
				error: {
					message: 'Invalid word'
				}
			};
		}
		this.#guesses.push(this.#currentGuess);
		this.#currentGuess = '';
		this.#answers = this.#checkWords();
		// this.#success = this.#answers.at(-1) === successAnswer;
		return {};
	};

	#checkWords = () => {
		const before = performance.now();
		const answer = getGameWord(this.#gameNum);
		const answers = this.#guesses.map((guess: string) => {
			return checkWord({ guess, answer });
		});
		const after = performance.now();
		console.log('calculate answers:', after - before);
		return answers;
	};
}

const getLetterLocations = (s: string, l: string) => {
	return s
		.split('')
		.map((l: string, i: number) => ({ letter: l, index: i }))
		.filter((slot) => slot.letter === l)
		.map((slot) => slot.index);
};

function containsLetter({
	index,
	guess,
	answer
}: {
	index: number;
	guess: string;
	answer: string;
}) {
	const letter = guess.charAt(index);
	const guessLocations = getLetterLocations(guess, letter);
	const answerLocations = getLetterLocations(answer, letter);
	const correctCount = guessLocations.filter((location) =>
		answerLocations.includes(location)
	).length;
	const previousContainsCount = getLetterLocations(guess.slice(0, index), letter).filter(
		(index) => !answerLocations.includes(index)
	).length;
	return correctCount + previousContainsCount < answerLocations.length;
}

function checkWord({ guess, answer }: { guess: string; answer: string }) {
	if (!guess.length) {
		return '_____';
	}
	const contains = guess
		.split('')
		.map((_, i) => (containsLetter({ index: i, guess, answer }) ? 'c' : 'i'));
	const correct = guess.split('').map((char, i) => (answer[i] === char ? 'x' : ''));

	const statuses = correct.map((status, i) => (status ? status : contains[i]));
	return statuses.join('');
}
