<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { appName } from '$lib/util/store';
	import { onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import LettuceKeyboard from '$lib/components/LettuceKeyboard.svelte';
	import LetterBox from '$lib/components/LetterBox.svelte';
	import { applyKey, applyWord, getKeyStatuses } from '$lib/util/gameFunctions';
	import { encodeState } from '$lib/util/state';
	import Cookies from 'js-cookie';
	import { invalidateAll } from '$app/navigation';

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
		form = { invalid: false, success: false };
		const updatedGuesses = applyKey(key, guesses, answers);
		data.state.guesses = updatedGuesses;
	};

	const updateData = (gameData: any) => {
		data = { state: gameData };
		const gameState = encodeState(gameData);
		Cookies.set('wordLettuceState', gameState, { expires: 365, secure: false });
	};

	const getRealIndex = (i: number, guesses: string[], answers: string[]) => {
		const filteredLength = guesses.filter(
			(g, j) => g.length === 5 && answers[j]?.length === 5
		).length;

		if (filteredLength < 6) {
			return i;
		} else if (answers.at(-1) === 'xxxxx') {
			return filteredLength - 6 + i;
		} else {
			return filteredLength - 5 + i;
		}
	};

	onMount(() => {
		const lastAnswer = data?.state?.answers?.at(-1) || '_____';
		if (lastAnswer === 'xxxxx') {
			openModal(data?.state?.answers, data?.state?.guesses?.length || 0, lastAnswer === 'xxxxx');
		}
	});

	$: guesses = data?.state?.guesses;
	$: answers = data?.state?.answers;
	$: answer = data?.state?.answer;
	$: current_guess = answers.length || 0;

	$: {
		if (form?.success) {
			openModal(data?.state?.answers, data?.state?.guesses?.length || 0, true);
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
	<title>{$appName} Daily</title>
</svelte:head>

<main class="flex flex-auto flex-col justify-between gap-2">
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
		class="m-auto grid h-full h-auto max-w-[min(700px,_55vh)] grid-rows-[repeat(6,_1fr)] gap-2"
	>
		{#each rows as _, i (getRealIndex(i, guesses, answers))}
			{@const realIndex = getRealIndex(i, guesses, answers)}
			{@const current = realIndex === current_guess}
			<div
				animate:flip={{ duration: 150 }}
				in:fade|local={{ duration: 150 }}
				out:fly|local={{ y: -100, duration: 150 }}
				class="grid grid-cols-[repeat(5,_1fr)] gap-2"
			>
				{#each columns as _, j}
					{@const answer = (answers[realIndex] || '_____')[j]}
					{@const letter = guesses[realIndex]?.at(j) || ''}

					<LetterBox
						{answer}
						{letter}
						slot={j}
						name={current ? 'guess' : ''}
						bulge={answers[realIndex]?.length === 5}
						wiggle={invalidForm && current}
					/>
				{/each}
			</div>
		{/each}
	</form>
	<div class="h-full max-h-[min(18rem,_30vh)]">
		<LettuceKeyboard on:key={(e) => handleKey(e.detail)} answers={keys} />
	</div>
</main>
<Modal bind:modalActions />
