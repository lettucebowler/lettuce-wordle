<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import CopyClipBoard from '$lib/components/CopyClipboard.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { toastError, toastSuccess, toastClear } from '$lib/util/toastActions';
	import { isValidWord } from '$lib/util/words';
	import LetterGrid from '$lib/components/LetterGrid.svelte';
	import LettuceKeyboard from '$lib/components/LettuceKeyboard.svelte';
	import type { Letter, Word } from '../types/types';
	import { Status } from '$lib/types/types';
	import { appName } from '$lib/util/store';


	export let answer: string;

	const resetWords = () => {
		const arr: Word[] = [];
		for (let i = 0; i < 6; i++) {
			arr.push({
				complete: false,
				word: Array(5)
					.fill(0)
					.map((): Letter => ({ letter: '', status: Status.NONE }))
			});
		};
		return arr;
	};

	let words: Word[] = resetWords();

	const isSuccess = (words: Word[]) => {
		const complete = words.filter((w: Word) => w.complete);
		const [last] = complete.reverse();
		if (complete.length === 0) {
			return false;
		}
		const guess = last.word.map((l: Letter) => l.letter).join('');
		return guess === answer;
	};

	const getLetterLocations = (s: string, l: string) => {
		return s
			.split('')
			.map((l: string, i: number) => ({ letter: l, index: i }))
			.filter((slot) => slot.letter === l)
			.map((slot) => slot.index);
	};

	const containsLetter = (letter: Letter, index: number, guess: string, answer: string) => {
		const guessLocations = getLetterLocations(guess, letter.letter);
		const answerLocations = getLetterLocations(answer, letter.letter);
		const correctCount = guessLocations.filter((location) =>
			answerLocations.includes(location)
		).length;
		const previousContainsCount = getLetterLocations(guess.slice(0, index), letter.letter).filter(
			(index) => !answerLocations.includes(index)
		).length;
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
		const alphabet = Object.assign(
			{},
			...Array.from(Array(26))
				.map((e, i) => i + 65)
				.map((x) => String.fromCharCode(x))
				.map((letter: string) => ({
					[letter.toLowerCase()]: Status.NONE
				}))
		);
		const letterStrings = words
			.filter((w: Word) => w.complete)
			.map((word) => word.word)
			.flat()
			.map((l) => JSON.stringify(l));
		const letters: Letter[] = Array.from(new Set(letterStrings)).map((s: string) => JSON.parse(s));
		const correctList = letters
			.filter((letter) => letter.status === Status.CORRECT)
			.map((l: Letter) => ({ [l.letter]: l.status }));
		const correct: { [x: string]: Status } = Object.assign({}, ...correctList);
		const containsList = letters
			.filter((letter) => letter.status === Status.CONTAINS)
			.map((l: Letter) => ({ [l.letter]: l.status }));
		const contains: { [x: string]: Status } = Object.assign({}, ...containsList);
		const incorrectList = letters
			.filter((letter) => letter.status === Status.INCORRECT)
			.map((l: Letter) => ({ [l.letter]: l.status }));
		const incorrect: { [x: string]: Status } = Object.assign({}, ...incorrectList);

		return { ...alphabet, ...incorrect, ...contains, ...correct };
	};

	const getStatusEmoji = (status: Status) => {
		const green = '🟩';
		const yellow = '🟨';
		const black = '⬛';
		switch (status) {
			case Status.CORRECT:
				return green;
			case Status.CONTAINS:
				return yellow;
			default:
				return black;
		}
	};

	const shareGame = async () => {
		if (typeof window !== 'undefined') {
			if (!success) {
				return toastError('Cannot share game in progress.');
			}
			const gameStatus = words
				.filter((w: Word) => w.complete)
				.map((w: Word) => w.word.map((l: Letter) => getStatusEmoji(l.status)));
			const today = `${$appName} ${new Date().toLocaleDateString()} ${gameStatus.length}/6`;
			const strings = gameStatus.map((w) => w.join(''));
			const share = [today, ...strings].join('\n');
			const clipBoard = new CopyClipBoard({
				target: document.getElementById('clipboard'),
				props: { name: share }
			});
			clipBoard.$destroy();
			toastSuccess('Results copied to clipboard');
		}
	};

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
		keyStatuses = getKeyStatuses(words);
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
		key === 'Share' && shareGame();
		key.match(/[a-z]/i) && key.length === 1 && processLetterKey(key);
	};

	$: attempt = words.filter((w: Word) => w.complete).length;

	$: success = isSuccess(words);

	$: attempt === 6 && !success && toastError('You lose.');

	$: success && toastSuccess('Yay you win!');

	let keyStatuses: {
		[x: string]: Status;
	} = getKeyStatuses(words);

	beforeNavigate((nav) => {
		console.log('bleh');
		words = resetWords();
		toastClear();
	});
</script>

<svelte:window on:keydown={(event) => handleKeyPress(event.key)} />
<div class="spacing" />
<LetterGrid data={words} />
<div class="spacing" />
<LettuceKeyboard on:keyPress={(event) => handleKeyPress(event.detail.key)} {keyStatuses} />
<SvelteToast />
<div id="clipboard" />
{#if attempt > 5 && !success}
	<div class="answer">{answer}</div>
{/if}

<style>
	.spacing {
		height: 16px;
	}

	.answer {
		color: var(--nord-6);
		font-size: 2rem;
	}
</style>
