<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import CopyClipBoard from '../components/CopyClipboard.svelte';
	import { toastError, toastSuccess } from '../util/toastActions';
	import LetterGrid from '../components/LetterGrid.svelte';
	import LettuceKeyboard from '../components/LettuceKeyboard.svelte';
	import { getDailyWord, isValidWord } from '../util/words';
	import type { Letter, Word } from '../types/types';
	import { Status } from '../types/types';

	// export let answer = getDailyWord();
	export let answer = 'crepe';

	const words: Word[] = [];

	for (let i = 0; i < 6 ; i++) {
		words.push({
			complete: false,
			word: Array(5)
				.fill(0)
				.map((): Letter => ({ letter: '', status: Status.NONE }))
		});
	}

	const isSuccess = (words: Word[]) => {
		const complete = words.filter((w: Word) => w.complete);
		const [last] = complete.reverse();
		if (complete.length === 0) {
			return false;
		}
		const guess = last.word.map((l: Letter) => l.letter).join('');
		return guess === answer;
	};

	const containsLetter = (letter: Letter, index: number, guess: string, answer: string) => {
		// IF in word but wrong spot AND all correct instances of that letter are not filled AND there isn't a similar letter ahead in the guess.
		const guessLocations = guess
			.split('')
			.map((l: string, i: number) => ({ letter: l, index: i }))
			.filter((slot) => slot.letter === letter.letter)
			.map((slot) => slot.index);
		const answerLocations = answer
			.split('')
			.map((l: string, i: number) => ({ letter: l, index: i }))
			.filter((slot) => slot.letter === letter.letter)
			.map((slot) => slot.index);
		const correctCount = guessLocations
			.filter((location) => answerLocations.includes(location))
			.length;
		const previousContainsCount = guess.slice(0, index)
			.split('')
			.map((l: string, i: number) => ({ letter: l, index: i }))
			.filter((slot) => slot.letter === letter.letter)
			.map((slot) => slot.index)
			.filter((index) => !answerLocations.includes(index))
			.length;
		return correctCount + previousContainsCount < answerLocations.length;
	};

	const getLetterStatus = (
		letter: Letter,
		i: number,
		word: string,
		answer: string,
		complete: boolean
	) => {
		const none = !complete || letter.letter === '';
		const contains = containsLetter(letter, i, word, answer);
		const correct = answer.split('')[i] === letter.letter;

		if (none) {
			return Status.NONE;
		}

		if (correct) {
			return Status.CORRECT;
		}

		if (contains) {
			return Status.CONTAINS;
		}

		return Status.INCORRECT;
	};

	const getLetterStatuses = (w: Word): Word => {
		const guess = w.word.map((l: Letter) => l.letter).join('');
		const lettersWithStatuses: Letter[] = w.word.map((l: Letter, i: number) => ({
			...l,
			status: getLetterStatus(l, i, guess, answer, true)
		}));
		return {
			complete: true,
			word: lettersWithStatuses
		};
	};

	const getKeyStatuses = (words: Word[]) => {
		const alphabet = Array.from(Array(26))
			.map((e, i) => i + 65)
			.map((x) => String.fromCharCode(x))
			.map((letter: string) => ({
				[letter.toLowerCase()]: Status.NONE
			}))
			.reduce(function (result, currentObject) {
				for (var key in currentObject) {
					result[key] = currentObject[key];
				}
				return result;
			}, {});
		const letters = words.map((word) => word.word).flat();
		const correct = letters
			.filter((letter) => letter.status === Status.CORRECT)
			.map((l: Letter) => ({ [l.letter]: l.status }))
			.reduce(function (result, currentObject) {
				for (var key in currentObject) {
					result[key] = currentObject[key];
				}
				return result;
			}, {});
		const contains = letters
			.filter((letter) => letter.status === Status.CONTAINS)
			.map((l: Letter) => ({ [l.letter]: l.status }))
			.reduce(function (result, currentObject) {
				for (var key in currentObject) {
					result[key] = currentObject[key];
				}
				return result;
			}, {});
		const incorrect = letters
			.filter((letter) => letter.status === Status.INCORRECT)
			.map((l: Letter) => ({ [l.letter]: l.status }))
			.reduce(function (result, currentObject) {
				for (var key in currentObject) {
					result[key] = currentObject[key];
				}
				return result;
			}, {});
		return { ...alphabet, ...incorrect, ...contains, ...correct };
	};

	const getStatusEmoji = (status: Status) => {
		const green = '🟩';
		const yellow = '🟨';
		const black = '⬛';
		switch(status) {
			case Status.CORRECT:
				return green;
			case Status.CONTAINS:
				return yellow;
			default:
				return black;
		}
	}

	const shareGame = async () => {
		if (typeof window !== 'undefined') {
			if (!success) {
				return toastError('Cannot share game in progress.');
			}
			const gameStatus = words.filter((w: Word) => w.complete).map((w: Word) => (w.word.map((l: Letter) => (getStatusEmoji(l.status)))));
			const today = `Gradle ${new Date().toLocaleDateString()} ${gameStatus.length}/6`;
			const strings = gameStatus.map((w) => w.join(''));
			const share = [today, ...strings].join('\n');
			const clipBoard = new CopyClipBoard({
				target: document.getElementById('clipboard'),
				props: { name: share },
			});
			clipBoard.$destroy();
			toastSuccess('Results copied to clipboard');
		}
	}

	const processEnterKey = () => {
		if (success) {
			return;
		}
		const guess = words[attempt];
		const valid = isValidWord(guess);
		const long = guess.word.every((l: Letter) => l.letter !== '');

		if (!long) {
			return toastError('Not enough letters.');
		} else if (!valid) {
			return toastError('Not in word list.');
		} else if (attempt > 5) {
			return toastError('No more attempts remaining.');
		}

		words[attempt] = getLetterStatuses(words[attempt]);
	};

	const processBackspaceKey = () => {
		if (success) {
			return;
		}
		const incomplete = words.slice(attempt);
		let [current] = incomplete;
		const index = 4 - current.word.filter((l: Letter) => l.letter === '').length;
		if (index < 0) {
			return;
		}
		words[attempt].word[index].letter = '';
	};

	const processLetterKey = (key: string) => {
		if (success) {
			return;
		}
		const incomplete = words.slice(attempt);
		let [current] = incomplete;
		const index = current.word.filter((l: Letter) => l.letter !== '').length;
		if (index > 4) {
			return;
		}
		words[attempt].word[index].letter = key;
	};

	const handleKeyPress = (key: string) => {
		key === 'Enter' && processEnterKey();
		key === 'Backspace' && processBackspaceKey();
		console.log(key);
		key === 'Share' && shareGame();
		key.match(/[a-z]/i) && key.length === 1 && processLetterKey(key);
	};

	$: attempt = words.filter((w: Word) => w.complete).length;

	$: success = isSuccess(words);

	$: attempt === 6 && !success && toastError('You lose.');

	$: success && toastSuccess('Yay you win!');

	$: keyStatuses = getKeyStatuses(words);
</script>

<svelte:window on:keydown={(event) => handleKeyPress(event.key)} />
<div class="spacing" />
<LetterGrid data={words} />
<div class="spacing" />
<LettuceKeyboard on:keyPress={(event) => handleKeyPress(event.detail.key)} {keyStatuses} />
<SvelteToast />
<div id="clipboard"></div>
{#if attempt > 5 && !success}
	<div class="answer">{answer}</div>
{/if}

<style>
	.spacing {
		padding: 16px 0 16px 0;
	}

	.answer {
		color: var(--nord-6);
		font-size: 2rem;
	}
</style>
