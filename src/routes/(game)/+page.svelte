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
	import { invalidateAll } from '$app/navigation';
	import { getDailyWord } from '$lib/util/words';
	import { browser } from '$app/environment';
	import { getGameNum } from '$lib/util/share';

	export let data: import('./$types').PageData;
	export let form: import('./$types').ActionData;

	let modalActions: {
		open(answers: string[], guesses: number, success: boolean, user: string): void;
	};
	let invalidForm = false;
	let guesses: { guess: string; complete: boolean }[] = [];
	let current_guess = 0;
	let keys = {};

	const rows = Array(6);
	const columns = Array(5);

	const openModal = (answers: string[], guesses: number, success: boolean, user = '') => {
		setTimeout(() => modalActions?.open(answers, guesses, success, user), 500);
	};

	const handleKey = (key: string) => {
		form = { invalid: false, success: false };
		data.state = applyKey(key, data.state, data.answers);
		data = data;
	};

	const updateData = (gameData: { guess: string; complete: boolean }[]) => {
		data.state = gameData;
		data.answers = checkWords(data.state, getDailyWord());
		data = data;
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
		const lastAnswer = data.answers?.at(-1) || '_____';
		if (lastAnswer === 'xxxxx') {
			openModal(
				data.answers,
				guesses?.length || 0,
				lastAnswer === 'xxxxx',
				data?.session?.user?.login || ''
			);
		}
	});

	// handle form stuff on submit
	$: {
		if (form?.success && browser) {
			openModal(data.answers, guesses?.length || 0, true, data?.session?.user?.login || '');
		}

		if (form?.invalid) {
			invalidForm = true;
			setTimeout(() => {
				invalidForm = false;
			}, 150);
		}
	}

	// keep state synced up
	$: {
		guesses = data?.state;
		current_guess = data.answers.length || 0;
		keys = getKeyStatuses(guesses, data.answers);
		Cookies.set('wordLettuce', getCookieFromGameState(data.state), {
			path: '/',
			httpOnly: false,
			expires: 1,
			secure: false
		});
	}
</script>

<main class="flex w-full flex-auto flex-col items-center justify-between gap-2">
	<div class="flex h-auto w-full flex-auto flex-col items-center">
		<form
			method="POST"
			action="?/enter"
			id="game"
			use:enhance={(event) => {
				const guess = event.data.getAll('guess').map((l) => l.toString().toLowerCase());
				const { metadata, updatedGuesses } = applyWord(data.state, guess, data.answers);
				form = metadata;
				updateData(updatedGuesses);

				if (!metadata.success) {
					event.cancel();
					return;
				}

				if (guess.length < 5) {
					event.cancel();
					invalidForm = true;
					setTimeout(() => {
						invalidForm = false;
					}, 150);
					return;
				}

				return async ({ result }) => {
					applyAction(result);
					await invalidateAll();
				};
			}}
			class="m-auto flex max-w-[min(700px,_55vh)]"
		>
			<div class="grid w-full grid-rows-[repeat(6,_1fr)] gap-2">
				{#each rows as _, i (getRealIndex(i, guesses, data.answers))}
					{@const realIndex = getRealIndex(i, guesses, data.answers)}
					{@const current = realIndex === current_guess}
					<div
						animate:flip={{ duration: 150 }}
						out:slide|local={{ duration: 150 }}
						class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
					>
						{#each columns as _, j}
							{@const answer = (data.answers[realIndex] || '_____')[j]}
							{@const letter = guesses[realIndex]?.guess?.at(j) || ''}
							<LetterBox
								{answer}
								{letter}
								slot={j}
								name={current ? 'guess' : 'not'}
								bulge={data.answers[realIndex]?.length === 5}
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
