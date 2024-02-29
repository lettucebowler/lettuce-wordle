<script lang="ts">
	import Modal from './Modal.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import Keyboard from './Keyboard.svelte';
	import { applyKey, getKeyStatuses, applyWord } from '$lib/util/gameFunctions';
	import { getCookieFromGameState } from '$lib/util/encodeCookie';
	import Cookies from 'js-cookie';
	import { Toaster } from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { CompleteGuess, IncompleteGuess } from '$lib/types/gameresult';
	import { allowedGuess } from '$lib/types/gameresult';
	import { createExpiringBoolean } from './stores';
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { toastError, toastLoading, toastSuccess } from './toast';
	import { safeParse, string } from 'valibot';

	let { data, form } = $props();
	let modal = $state<Modal>();
	let modalTimer = $state<NodeJS.Timeout>();
	let game = $state({
		state: data.state,
		answers: data.answers,
		success: data.success
	});
	let formState = $state(
		form
			? {
					success: form.success,
					invalid: form.invalid
				}
			: null
	);

	$effect(() => {
		game = {
			state: data.state,
			answers: data.answers,
			success: data.success
		};
	});

	$effect(() => {
		formState = form
			? {
					success: form.success,
					invalid: form.invalid
				}
			: null;
	});

	$effect(() => {
		if (formState?.invalid) {
			wordIsInvalid.setTrue();
			toastError('Invalid word');
		}
	});

	const wordIsInvalid = createExpiringBoolean();
	const submittingWord = createExpiringBoolean();
	const delayScale = 0.03;
	const duration = 0.15;

	const openModal = ({
		answers = [],
		guesses = 0,
		user = ''
	}: {
		answers: string[];
		guesses: number;
		user?: string;
	}) => {
		if (modal) {
			modalTimer = setTimeout(() => {
				if (modal?.open) {
					modal.open({ answers, guesses, user });
				}
			}, 500);
		}
	};

	const handleKey = (key: string) => {
		if (key.toLowerCase() !== 'enter') {
			const newState = applyKey(key, game.state, game.answers);
			game = {
				...game,
				state: newState
			};
		}
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
		} else if (game.success) {
			return filteredLength - 6 + i;
		} else {
			return filteredLength - 5 + i;
		}
	};

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		if ($submittingWord || game.success) {
			cancel();
			return;
		}
		submittingWord.setTrue();
		const guessData = safeParse(
			string([allowedGuess()]),
			formData
				.getAll('guess')
				.map((l) => l.toString().toLowerCase())
				.join('')
		);
		if (!guessData.success) {
			cancel();
			formState = {
				success: false,
				invalid: true
			};
			return;
		}
		const guess: IncompleteGuess = {
			guess: guessData.output,
			complete: false
		};
		const { metadata, updatedAnswers, updatedGuesses } = applyWord(
			game.state.filter((guess): guess is CompleteGuess => guess.complete),
			guess,
			game.answers
		);
		if (metadata.invalid) {
			cancel();
			formState = {
				success: false,
				invalid: true
			};
			return;
		}
		game.state = updatedGuesses;
		game.answers = updatedAnswers;
		Cookies.set('wordLettuce', getCookieFromGameState(game.state), {
			path: '/',
			httpOnly: false,
			expires: 1,
			secure: false
		});

		game.success = metadata.success;
		if (!metadata.success) {
			cancel();
			formState = {
				success: false,
				invalid: false
			};
			return;
		}
		let id: string;
		if (data.session?.user) {
			id = toastLoading('beep boop...');
		}
		return async ({ result }) => {
			applyAction(result);
			if (data.session?.user?.login) {
				if (result.type === 'success') {
					toastSuccess('Game results saved', { id });
				} else {
					toastError('Failed to save game results', { id });
				}
			}
			openModal({
				answers: game.answers,
				guesses: game.state.length,
				user: data.session?.user?.login
			});
		};
	};

	onMount(() => {
		if (game.success) {
			openModal({
				answers: game.answers,
				guesses: game.state.length,
				user: data.session?.user?.login
			});
		}
	});

	beforeNavigate(() => {
		if (modalTimer) {
			clearTimeout(modalTimer);
		}
	});
</script>

<div class="flex flex-auto flex-col items-center gap-2">
	<main class="flex w-full flex-auto flex-col items-center justify-end justify-between gap-2">
		<div class="flex w-full flex-auto flex-col items-center">
			<form
				method="POST"
				action="?/enter"
				id="game"
				use:enhance={enhanceForm}
				class="my-auto flex w-full max-w-[min(700px,_55vh)]"
			>
				<div class="grid w-full grid-rows-[repeat(6,_1fr)] gap-2">
					{#each [...Array(6).keys()] as i (getRealIndex(i, game.state, game.answers))}
						{@const realIndex = getRealIndex(i, game.state, game.answers)}
						{@const current = realIndex === game.answers.length}
						<div
							class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
							out:slide={{ duration: duration * 1000 }}
							animate:flip={{ duration: duration * 1000 }}
						>
							{#each [...Array(5).keys()] as j}
								{@const answer = game.answers?.at(realIndex)?.at(j) ?? ''}
								{@const letter = game.state[realIndex]?.guess?.at(j) ?? ''}
								{@const doJump = browser && game.answers.at(realIndex)?.length === 5}
								{@const doWiggle = browser && $wordIsInvalid && current}
								{@const doWiggleOnce = !browser && form?.invalid && current}
								<div
									class="box-border grid aspect-square items-center rounded-xl border-charade-700 text-center text-2xl font-bold text-snow-300 shadow transition-all sm:text-3xl"
									class:border-0={!!answer}
									class:border-4={!answer}
									class:bg-charade-900={!answer}
									class:border-solid={!answer}
									class:bg-aurora-400={answer === 'x'}
									class:bg-aurora-300={answer === 'c'}
									class:bg-charade-700={answer === 'i'}
									class:animate-wiggle={doWiggle}
									class:animate-wiggle-once={doWiggleOnce}
									class:animate-jump={doJump}
									style:transition-delay={`${j * delayScale + duration}s`}
									style:animation-delay={$wordIsInvalid ? '0s' : `${j * delayScale}s`}
									style:transition-duration={`${duration}ms`}
								>
									<input
										type="hidden"
										readonly
										value={letter.toUpperCase()}
										name={current ? 'guess' : undefined}
									/>
									{letter.toUpperCase()}
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</form>
		</div>
		<div class="flex h-full max-h-[min(20rem,_30vh)] w-full flex-[5_1_auto] flex-col">
			<Keyboard
				on:key={(e) => handleKey(e.detail)}
				answers={getKeyStatuses(game.state, game.answers)}
			/>
		</div>
	</main>
	<Modal bind:this={modal} />
	<Toaster />
</div>
