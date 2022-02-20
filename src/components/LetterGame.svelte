<script lang="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { toastError, toastSuccess } from '../util/toastActions';
	import LetterGrid from '../components/LetterGrid.svelte';
	import LettuceKeyboard from '../components/LettuceKeyboard.svelte';
	import { getDailyWord, isValidWord } from '../util/words';
	import type { Letter, Word } from '../types/types';
	import { Status } from '../types/types';

	export let answer = getDailyWord();

	const words: Word[] = [];

	for (const i in [...Array(6).keys()]) {
		words.push({
			complete: false,
			word: Array(5).fill(0).map((): Letter => ({letter: '', status: Status.NONE}))
		});
	}

	const isSuccess = (words: Word[]) => {
		
		const complete = words.filter((w: Word) => w.complete);
		const [last, ...rest] = complete.reverse();
		if (complete.length === 0) {
			return false;
		}
		console.log(last);
		const guess = last.word.map((l: Letter) => l.letter).join('');
		return guess === answer;

	};

	const containsLetter = (letter: Letter, index: number, guess: string, answer: string) => {
		const guessLocations = guess
			.split('')
			.map((l: string, i: number) => ({ letter: l, index: i }))
			.filter((slot) => slot.letter === letter.letter)
			.map((slot) => slot.index);
		const answerLocations = answer
			.split('')
			.map((l: string, i: number) => ({ letter: l, index: i }))
			.filter((slot) => slot.letter === letter.letter)
			.map((slot) => slot.index)
			.filter((index) => !guessLocations.includes(index));
		return !!answerLocations.length;
	};

	const getLetterStatus = (letter: Letter, i: number, word: string, answer: string, complete: boolean) => {
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
		const lettersWithStatuses: Letter[] = w.word.map((l: Letter, i: number) => ({ ...l, status: getLetterStatus(l, i, guess, answer, true)}));
		return {
			complete: true,
			word: lettersWithStatuses,
		};
	};

	const processEnterKey = () => {
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
		const incomplete = words.slice(attempt);
		let [current] = incomplete;
		const index = 4 - current.word.filter((l: Letter) => l.letter === '').length;
		if (index < 0) {
			return;
		}
		words[attempt].word[index].letter = '';
	};

	const processLetterKey = (key: string) => {
		const incomplete = words.slice(attempt);
		let [current] = incomplete;
		const index = current.word.filter((l: Letter) => l.letter !== '').length;
		if (index > 4) {
			return;
		}
		words[attempt].word[index].letter = key;
	};

	const handleKeyPress = (key: string) => {
		if (success) {
			return;
		}

		key === 'Enter' && processEnterKey();
		key === 'Backspace' && processBackspaceKey();
		key.match(/[a-z]/i) && key.length === 1 && processLetterKey(key);
	};

	$: attempt = words.filter((w: Word) => w.complete).length;

	$: success = isSuccess(words);

	$: attempt === 6 && !success && toastError('You lose.');

	$: success && toastSuccess('Yay you win!');
</script>

<svelte:window on:keydown={(event) => handleKeyPress(event.key)} />
<div class="spacing" />
<LetterGrid data={words} />
<div class="spacing" />
<!-- <LettuceKeyboard on:keyPress={(event) => handleKeyPress(event.detail.key)} /> -->
<SvelteToast />
{#if attempt > 5 && !isSuccess}
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
