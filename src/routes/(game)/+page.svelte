<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { enhance, type SubmitFunction } from '$app/forms';
	import LettuceKeyboard from '$lib/components/LettuceKeyboard.svelte';
	import LetterBox from '$lib/components/LetterBox.svelte';
	import { applyKey, getKeyStatuses, applyWord } from '$lib/util/gameFunctions';
	import { getCookieFromGameState } from '$lib/util/state';
	import Cookies from 'js-cookie';
	import { browser } from '$app/environment';

	export let data: import('./$types').PageData;
	export let form: import('./$types').ActionData;

	let modalActions: {
		open(answers: string[], guesses: number, success: boolean, user: string): void;
	};
	let invalidForm = false;

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
				data.state?.length || 0,
				lastAnswer === 'xxxxx',
				data?.session?.user?.login || ''
			);
		}
	});

	// handle form stuff on submit
	$: {
		if (form?.success && browser) {
			openModal(data.answers, data.state?.length || 0, true, data?.session?.user?.login || '');
		}

		if (form?.invalid) {
			invalidForm = true;
			setTimeout(() => {
				invalidForm = false;
			}, 150);
		}
	}

	const enhanceForm: SubmitFunction = (event) => {
		const guess = event.data.getAll('guess').map((l) => l.toString().toLowerCase());

		if (guess.length < 5) {
			event.cancel();
			invalidForm = true;
			setTimeout(() => {
				invalidForm = false;
			}, 150);
			return;
		}

		const { metadata, updatedAnswers } = applyWord(data.state, guess, data.answers);
		form = metadata;
		data.answers = updatedAnswers;
		data = data;
		Cookies.set('wordLettuce', getCookieFromGameState(data.state), {
			path: '/',
			httpOnly: false,
			expires: 1,
			secure: false
		});

		if (!metadata.success) {
			event.cancel();
			return;
		}

		return async ({ update }) => {
			update();
		};
	};
</script>

<main class="flex w-full flex-auto flex-col items-center justify-between gap-2">
	<div class="flex h-auto w-full flex-auto flex-col items-center">
		<form
			method="POST"
			action="?/enter"
			id="game"
			use:enhance={enhanceForm}
			class="my-auto flex w-full max-w-[min(700px,_55vh)]"
		>
			<div class="grid w-full grid-rows-[repeat(6,_1fr)] gap-2">
				{#each rows as _, i (getRealIndex(i, data.state, data.answers))}
					{@const realIndex = getRealIndex(i, data.state, data.answers)}
					{@const current = realIndex === data.answers.length}
					<div
						animate:flip={{ duration: 150 }}
						out:slide|local={{ duration: 150 }}
						class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
					>
						{#each columns as _, j}
							{@const answer = (data.answers[realIndex] || '_____')[j]}
							{@const letter = data.state[realIndex]?.guess?.at(j) || ''}
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
		<LettuceKeyboard
			on:key={(e) => handleKey(e.detail)}
			answers={getKeyStatuses(data.state, data.answers)}
		/>
	</div>
</main>
<Modal bind:modalActions csrf={data.csrfToken} />
