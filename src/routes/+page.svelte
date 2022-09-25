<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { appName } from '$lib/util/store';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import LettuceKeyboard from '$lib/components/LettuceKeyboard.svelte';
	import LetterBox from '$lib/components/LetterBox.svelte';
	import { applyWord, getKeyStatuses } from '$lib/util/gameFunctions';
	import { encodeState } from '$lib/util/state';
	import Cookies from 'js-cookie';

	export let data: import('./$types').PageData;
	export let form: import('./$types').ActionData;

	let modalActions: { open(answers: string[], guesses: number, success: boolean): void };
	let invalidForm = false;
	let answers: string[];
	let guesses: string[];
	let keys = {};

	const rows = Array(6);
	const columns = Array(5);

	const openModal = (answers: string[], guesses: number, success: boolean) => {
		setTimeout(() => modalActions?.open(answers, guesses, success), 500);
	};

	const handleKey = (key: string) => {
		form = { ...form, invalid: false };
		const guess = data.state.guesses[current_guess] || '';
		if (key.toLowerCase() === 'backspace') {
			const [_, ...rest] = guess.split('').reverse();
			data.state.guesses[current_guess] = rest.reverse().join('');
		} else {
			data.state.guesses[current_guess] = guess + key;
		}
	};

	const updateData = (gameData: any) => {
		data = { state: gameData };
		const gameState = encodeState(gameData);
		console.log(gameState);
		Cookies.set('wordLettuceState', gameState, { expires: 365, secure: false });
	};

	onMount(() => {
		const attempts = data?.state?.answers?.length || 0;
		const lastAnswer = data?.state?.answers?.at(-1) || '_____';
		if (lastAnswer === 'xxxxx' || attempts === 6) {
			openModal(data?.state?.answers, data?.state?.guesses?.length || 0, lastAnswer === 'xxxxx');
		}
	});

	$: guesses = data?.state?.guesses;
	$: answers = data?.state?.answers;
	$: answer = data?.state?.answer;

	$: current_guess = data?.state.answers?.length || 0;

	$: {
		if (form?.success) {
			openModal(data?.state?.answers, data?.state?.guesses?.length || 0, true);
		}
		if (form?.failure) {
			openModal(data?.state?.answers, data?.state?.guesses?.length || 0, false);
		}

		if (form?.invalid) {
			invalidForm = true;
			setTimeout(() => {
				invalidForm = false;
			}, 150);
		}
	}

	$: {
		keys = {};
		keys = getKeyStatuses(data?.state?.guesses, data?.state?.answers);
	}
</script>

<svelte:head>
	<meta charset="UTF-8" />
	<meta name="description" content="Lettuce Wordle`" />
	<title>{$appName} Daily</title>
</svelte:head>

<main class="flex justify-between flex-col flex-auto gap-2">
	<form
		method="POST"
		action="?/enter"
		id="game"
		use:enhance={({ data, cancel }) => {
			// @ts-ignore
			const guess = data.getAll('guess').map((l) => l.toLowerCase());
			const game = {
				answers,
				guesses,
				answer
			};
			const { metadata, updatedGame } = applyWord(game, guess);
			form = metadata;
			updateData(updatedGame);

			cancel();
		}}
		class="grid gap-2 grid-cols-5 h-full m-auto max-w-[min(700px,_55vh)] h-auto"
	>
		{#each rows as _, i}
			{@const current = i === current_guess}
			{#each columns as _, j}
				{@const answer = (answers[i] || '_____')[j]}
				{@const letter = guesses?.at(i)?.at(j) || ''}
				<LetterBox
					{answer}
					{letter}
					slot={j}
					name={current ? 'guess' : ''}
					bulge={i === current_guess - 1 &&
						guesses?.at(-1)?.length === 5 &&
						!!answers?.at(guesses.length - 1)}
					wiggle={invalidForm && i === current_guess}
				/>
			{/each}
		{/each}
	</form>
	<div class="h-full max-h-[min(18rem,_30vh)]">
		<LettuceKeyboard on:key={(e) => handleKey(e.detail)} answers={keys} />
	</div>
</main>
<Modal bind:modalActions />
