<script lang="ts">
	import Cookies from 'js-cookie';
	import { beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toastError, toastClear } from '$lib/util/toastActions';
	import LetterGrid from '$lib/components/LetterGrid.svelte';
	import LettuceKeyboard from '$lib/components/LettuceKeyboard.svelte';
	import Modal from '$lib/components/Modal.svelte';

	const getLetterLocations = (s: string, l: string) => {
		return s
			.split('')
			.map((l: string, i: number) => ({ letter: l, index: i }))
			.filter((slot) => slot.letter === l)
			.map((slot) => slot.index);
	};

	const containsLetter = (letter: string, index: number, guess: string, answer: string) => {
		const guessLocations = getLetterLocations(guess, letter);
		const answerLocations = getLetterLocations(answer, letter);
		const correctCount = guessLocations.filter((location) =>
			answerLocations.includes(location)
		).length;
		const previousContainsCount = getLetterLocations(guess.slice(0, index), letter).filter(
			(index) => !answerLocations.includes(index)
		).length;
		return correctCount + previousContainsCount < answerLocations.length;
	};

	const getLetterStatus = (
		letter: string,
		i: number,
		word: string,
		answer: string,
		complete: boolean
	) => {
		const none = !complete || letter === '';
		const contains = containsLetter(letter, i, word, answer);
		const correct = answer.split('')[i] === letter;

		if (none) {
			return 'none';
		}

		if (correct) {
			return 'correct';
		}

		if (contains) {
			return 'contains';
		}

		return 'incorrect';
	};

	const getLetterStatuses = (guess: string): string[] => {
		if (!guess) {
			return ['none', 'none', 'none', 'none', 'none'];
		}
		return guess.split('').map((l, i) => {
			return getLetterStatus(l, i, guess, answer, true);
		});
	};

	const getKeyStatuses = (words: string[], statuses: string[][]) => {
		const alphabet = Object.assign(
			{},
			...Array.from(Array(26))
				.map((e, i) => i + 65)
				.map((x) => String.fromCharCode(x))
				.map((letter: string) => ({
					[letter.toLowerCase()]: 'none'
				}))
		);
		const letters = Array.from(
			new Set(
				words
					.map((w, i) =>
						w.split('').map((l, j) => ({
							letter: l,
							status: statuses[i][j]
						}))
					)
					.flat()
			)
		);
		const correctList = letters
			.filter((letter) => letter.status === 'correct')
			.map((l) => ({ [l.letter]: l.status }));
		const correct: { [x: string]: string } = Object.assign({}, ...correctList);
		const containsList = letters
			.filter((letter) => letter.status === 'contains')
			.map((l) => ({ [l.letter]: l.status }));
		const contains: { [x: string]: string } = Object.assign({}, ...containsList);
		const incorrectList = letters
			.filter((letter) => letter.status === 'incorrect')
			.map((l) => ({ [l.letter]: l.status }));
		const incorrect: { [x: string]: string } = Object.assign({}, ...incorrectList);

		return { ...alphabet, ...incorrect, ...contains, ...correct };
	};

	const handleWordSubmit = () => {
		if (words[attempt].length !== 5) {
			toastError('Word too short.');
			return;
		}
		statuses[attempt] = getLetterStatuses(words[attempt]);
		keyStatuses = getKeyStatuses(words, statuses);
		success = words[attempt] === answer;
		attempt++;
		if (words.filter(Boolean).length > 5 && !success) {
			words = words.concat(['']);
			statuses = statuses.concat([['none', 'none', 'none', 'none', 'none']]);
		}
	};

	const deleteLastLetter = () => {
		if (success) {
			return;
		}
		words[attempt] = words[attempt].slice(0, -1);
	};

	const AddLetter = (key: string) => {
		if (success || words[attempt].length > 4) {
			return;
		}

		words[attempt] = `${words[attempt]}${key}`;
	};

	const handleKeyPress = (event) => {
		const { key } = event;
		key.toLowerCase() === 'enter' && handleWordSubmit();
		(key.toLowerCase() === 'delete' || key.toLowerCase() === 'backspace') &&
			attempt < 6 &&
			deleteLastLetter();
		key.toLowerCase().match(/[a-z]/i) && key.length === 1 && AddLetter(key.toLowerCase());
		if (key.toLowerCase() === 'share') {
			showModal();
		}
	};

	const showModal = () => {
		if (success) {
			modalActions?.open && modalActions.open();
		}
	};

	let modalActions;

	const saveState = (answer: string, words: string[]) => {
		const state = JSON.stringify({
			answer,
			words,
			attempt: words.filter(Boolean).length
		});

		Cookies.set('state', state, { expires: 365 });
	};

	export let answer: string;

	export let words = ['', '', '', '', '', ''];

	export let success = false;

	let statuses = words.map((word) => getLetterStatuses(word));

	export let attempt = 0;

	let keyStatuses = getKeyStatuses(words, statuses);

	$: !!answer && success && showModal();

	$: saveState(answer, words);

	onMount(() => {
		if (success) {
			showModal();
		}
	});

	beforeNavigate(() => {
		toastClear();
	});
</script>

<LetterGrid bind:statuses bind:words on:wordSubmit={handleWordSubmit} />
<Modal bind:modalActions guesses={attempt} {success} {statuses} />
<div class="keyboard">
	<LettuceKeyboard on:letterTyped={(event) => handleKeyPress(event.detail)} {keyStatuses} />
</div>

<style>
	.keyboard {
		height: 100%;
		max-height: min(18rem, 30vh);
	}
</style>
