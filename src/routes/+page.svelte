<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { appName } from '$lib/util/store';
	import { onMount } from 'svelte';
	import { enhance, applyAction } from '$app/forms';
	import LettuceKeyboard from '$lib/components/LettuceKeyboard.svelte';
	import LetterBox from '$lib/components/LetterBox.svelte';
	import { applyKey, getKeyStatuses, applyWord, checkWords } from '$lib/util/gameFunctions';
	import { getCookieFromGameState } from '$lib/util/state';
	import Cookies from 'js-cookie';
	import { invalidate } from '$app/navigation';
	import { getDailyWord } from '$lib/util/words';
	import { browser } from '$app/environment';

	export let data: import('./$types').PageData;
	export let form: import('./$types').ActionData;

	let modalActions: {
		open(answers: string[], guesses: number, success: boolean, user: string): void;
	};
	let invalidForm = false;
	let guesses: { guess: string; complete: boolean }[] = [];
	let answers: string[] = [];
	let keys = {};

	const rows = Array(6);
	const columns = Array(5);

	const openModal = (answers: string[], guesses: number, success: boolean, user = '') => {
		setTimeout(() => modalActions?.open(answers, guesses, success, user), 500);
	};

	const handleKey = (key: string) => {
		form = { invalid: false, success: false };
		const updatedGuesses = applyKey(key, guesses);
		guesses = updatedGuesses;
	};

	const updateData = (gameData: { guess: string; complete: boolean }[]) => {
		data.state = gameData;
		data = data;
		const gameState = getCookieFromGameState(gameData);
		Cookies.set('wordLettuce', gameState, {
			httpOnly: false,
			path: '',
			expires: 1,
			secure: false
		});
	};

	const getRealIndex = (
		i: number,
		guesses: { guess: string; complete: boolean }[],
		answers: string[]
	) => {
		const filteredLength = guesses.filter(
			(g, j) => g.guess.length === 5 && answers[j]?.length === 5
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
		const lastAnswer = answers?.at(-1) || '_____';
		if (lastAnswer === 'xxxxx') {
			openModal(answers, guesses?.length || 0, lastAnswer === 'xxxxx', data?.user?.login || '');
		}
	});

	$: guesses = data?.state;
	$: answers = checkWords(guesses, getDailyWord());
	$: current_guess = answers.length || 0;

	$: {
		if (form?.success && browser) {
			openModal(answers, guesses?.length || 0, true, data?.user?.login || '');
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
		keys = getKeyStatuses(guesses, answers);
	}
</script>

<svelte:head>
	<title>{$appName} Daily</title>
</svelte:head>

<main class="flex flex-auto flex-col items-center justify-between gap-2">
	<div class="flex h-auto w-full flex-auto flex-col items-center">
		<form
			method="POST"
			action="?/enter"
			id="game"
			use:enhance={({ data, cancel }) => {
				const guess = data.getAll('guess').map((l) => l.toString().toLowerCase());
				// const { metadata, updatedGuesses } = applyWord(guesses, guess);
				// form = metadata;
				// updateData(updatedGuesses);

				// if (!metadata.success) {
				// 	cancel();
				// 	return;
				// }

				if (guess.length < 5) {
					cancel();
					invalidForm = true;
					setTimeout(() => {
						invalidForm = false;
					}, 150);
					return;
				}

				return async ({ result }) => {
					applyAction(result);
					await invalidate('/');
				};
			}}
			class="m-auto flex max-w-[min(700px,_55vh)]"
		>
			<div class="grid w-full grid-rows-[repeat(6,_1fr)] gap-2">
				{#each rows as _, i (getRealIndex(i, guesses, answers))}
					{@const realIndex = getRealIndex(i, guesses, answers)}
					{@const current = realIndex === current_guess}
					<div
						animate:flip={{ duration: 150 }}
						out:slide|local={{ duration: 150 }}
						class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
					>
						{#each columns as _, j}
							{@const answer = (answers[realIndex] || '_____')[j]}
							{@const letter = guesses[realIndex]?.guess?.at(j) || ''}
							<LetterBox
								{answer}
								{letter}
								slot={j}
								name={current ? 'guess' : 'not'}
								bulge={answers[realIndex]?.length === 5}
								wiggle={invalidForm && current}
							/>
						{/each}
					</div>
				{/each}
			</div>
		</form>
	</div>
	<div class="h-full max-h-[min(20rem,_30vh)] w-full">
		<LettuceKeyboard on:key={(e) => handleKey(e.detail)} answers={keys} />
	</div>
</main>
<Modal bind:modalActions />
