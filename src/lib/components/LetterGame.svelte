<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { toastError, toastClear } from '$lib/util/toastActions';
	import { isValidWord } from '$lib/util/words';
	import LetterGrid from '$lib/components/LetterGrid.svelte';
	import LettuceKeyboard from '$lib/components/LettuceKeyboard.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Letter, Word } from '../types/types';
	import { Status } from '$lib/types/types';
import { SvelteToast } from '@zerodevx/svelte-toast';

	export let answer: string;
	$: attempt = words.filter((w: Word) => w.complete).length;
	$: success = isSuccess(words);

	const resetWords = () => {
		const arr: Word[] = [];
		for (let i = 0; i < 6; i++) {
			arr.push({
				complete: false,
				word: Array(5)
					.fill(0)
					.map((): Letter => ({ letter: '', status: Status.NONE }))
			});
		}
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

	const submitWord = () => {
		if (success) {
			return;
		}
		const guess = words[attempt];
		const valid = isValidWord(guess);
		const long = guess.word.every((l: Letter) => !!l.letter);

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

	const deleteLastLetter = () => {
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

	const AddLetter = (key: string) => {
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

	const showModal = () => {
		if (success) {
			modalActions.open();
		} else {
			toastError('Game incomplete.');
		}
	};

	const handleKeyPress = (key: string) => {
		key.toLowerCase() === 'enter' && submitWord();
		(key.toLowerCase() === 'delete' || key.toLowerCase() === 'backspace') && deleteLastLetter();
		key.toLowerCase().match(/[a-z]/i) && key.length === 1 && AddLetter(key.toLowerCase());
		if (key.toLowerCase() === 'share') {
			showModal();
		}
	};

	let modalActions;

	$: answer && attempt === 6 && !success && toastError(`You lose. The answer is ${answer}`);

	$: success && modalActions.open();

	$: keyStatuses = getKeyStatuses(words);

	beforeNavigate(() => {
		words = resetWords();
		toastClear();
	});

	let showToast = true;

	const hideToast = () => {
		showToast = false;
	};
	const unHideToast = () => {
		showToast = true;
	};
</script>

<svelte:window on:keydown={(event) => handleKeyPress(event.key)} />
{#if showToast}
	<div class="toast">
		<SvelteToast />
	</div>
{/if}
<Modal bind:modalActions {words} on:close={() => unHideToast()} on:cancel={() => unHideToast()}/>
<LetterGrid data={words} />
<LettuceKeyboard on:keyPress={(event) => handleKeyPress(event.detail.key)} {keyStatuses} />
