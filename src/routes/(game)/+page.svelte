<script lang="ts">
	import Modal from './Modal.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import Keyboard from './Keyboard.svelte';
	import { getKeyStatuses, applyWord } from '$lib/util/gameFunctions';
	import { getCookieFromGameState } from '$lib/util/encodeCookie';
	import Cookies from 'js-cookie';
	import { Toaster } from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { CompleteGuess, IncompleteGuess, gameStateSchema } from '$lib/types/gameresult';
	import { createExpiringBoolean } from './stores';
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { toastError, toastLoading, toastSuccess } from './toast';

	export let data;
	export let form;

	let gameState = {
		state: data.state,
		answers: data.answers,
		success: data.success
	};
	$: formState = form;
	$: currentGuess = gameState.state.at(gameState.answers.length)?.guess ?? '';
	$: currentGuessIndex = gameState.answers.length;

	let modal: Modal;
	const { value: wordIsInvalid, setTrue: setInvalidFormTrue } = createExpiringBoolean();
	const delayScale = 0.03;
	const duration = 0.15;

	let modalTimer: number;
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
			modalTimer = setTimeout(() => modal.open({ answers, guesses, user }), 500);
		}
	};

	const handleKey = (key: string) => {
		if (key.toLowerCase() === 'backspace') {
			if (currentGuess.length) {
				currentGuess = currentGuess.split('').slice(0, -1).join('');
			}
		} else if (key.toLowerCase() !== 'enter') {
			currentGuess += key;
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
		} else if (gameState.success) {
			return filteredLength - 6 + i;
		} else {
			return filteredLength - 5 + i;
		}
	};

	function invalidWord() {
		setInvalidFormTrue();
		toastError('Invalid word');
	}

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		// disable submit if game already won
		if (gameState.success) {
			cancel();
			return;
		}
		const guess: IncompleteGuess = {
			guess: formData
				.getAll('guess')
				.map((l) => l.toString().toLowerCase())
				.join(''),
			complete: false
		};

		if (guess.guess.length !== 5) {
			cancel();
			invalidWord();
			return;
		}
		const { metadata, updatedAnswers, updatedGuesses } = applyWord(
			gameState.state.filter((guess): guess is CompleteGuess => guess.complete),
			guess,
			gameState.answers
		);
		if (metadata.invalid) {
			cancel();
			return;
		}
		if (!metadata.invalid) {
			const newGuess = updatedGuesses.at(-1);
			if (newGuess) {
				gameState.state.push(newGuess);
				gameState.answers = updatedAnswers;
			}
		}
		Cookies.set('wordLettuce', getCookieFromGameState(gameState.state), {
			path: '/',
			httpOnly: false,
			expires: 1,
			secure: false
		});

		if (!metadata.success) {
			cancel();
			formState = metadata;
			return;
		}

		const id = toastLoading('beep boop...');
		return async ({ result, update }) => {
			applyAction(result);
			if (data.session?.user.login) {
				if (result.type === 'success') {
					toastSuccess('Game results saved', { id });
				} else {
					toastError('Failed to save game results', { id });
				}
			}
		};
	};

	// onMount(() => {
	// 	data = data;
	// });

	beforeNavigate(() => {
		if (modalTimer) {
			clearTimeout(modalTimer);
		}
	});

	$: {
		if (formState?.invalid) {
			invalidWord();
		}
	}

	$: {
		if (gameState.success) {
			openModal({
				answers: gameState.answers,
				guesses: gameState.state.length,
				user: data.session?.user.login
			});
		}
	}
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
					{#each [...gameState.state
							.map((g, index) => {
								return { index, ...g };
							})
							.slice(-5), { guess: currentGuess, complete: false, index: currentGuessIndex }, ...Array(gameState.state.length < 5 ? 5 - gameState.state.length : 0)
							.fill(null)
							.map( (_, index) => ({ guess: '', complete: false, index: index + 1 + currentGuessIndex }) )] as guess (guess.index)}
						{@const realIndex = guess.index}
						{@const current = guess.index === currentGuessIndex}
						<div
							animate:flip={{ duration: duration * 1000 }}
							out:slide|local={{ duration: duration * 1000 }}
							class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
							id={guess.index.toString()}
						>
							{#each [...Array(5).keys()] as j (`${guess.index}-${j}`)}
								{@const answer = gameState.answers?.at(realIndex)?.at(j) ?? ''}
								{@const letter = guess.guess?.at(j) ?? ''}
								{@const doJump = browser && gameState.answers.at(realIndex)?.length === 5}
								{@const doWiggle = browser && $wordIsInvalid && current}
								{@const doWiggleOnce = !browser && form?.invalid && current}
								<div
									class="box-border grid aspect-square items-center rounded-xl text-center text-2xl font-bold text-snow-300 shadow sm:text-3xl transition-all border-charade-700"
									class:border-0={!!answer}
									class:border-4={!answer}
									class:bg-charade-900={!answer}
									class:border-solid={!answer}
									class:bg-aurora-400={answer === 'x'}
									class:bg-aurora-300={answer === 'c'}
									class:bg-charade-700={answer === 'i'}
									class:animate-wiggle={doWiggle}
									class:animate-wiggle-once={doWiggleOnce}
									style:transition-delay={`${j * delayScale + duration}s`}
									style:animation-delay={$wordIsInvalid ? '0s' : `${j * delayScale}s`}
									style:transition-duration={`${duration}ms`}
									class:animate-jump={doJump}
									style:z-index={guess.index}
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
				answers={getKeyStatuses(gameState.state, gameState.answers)}
			/>
		</div>
	</main>
	<Modal bind:this={modal} />
	<Toaster />
</div>
