<script lang="ts">
	import Modal from './Modal.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Keyboard from './Keyboard.svelte';
	import { applyKey, getKeyStatuses, applyWord } from '$lib/util/gameFunctions';
	import { getCookieFromGameState } from '$lib/util/encodeCookie';
	import Cookies from 'js-cookie';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { CompleteGuess, IncompleteGuess } from '$lib/types/gameresult';
	import { createExpiringBoolean } from './stores';
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';

	export let data;
	export let form;

	let modal: Modal;
	const { value: invalidForm, setTrue: setInvalidFormTrue } = createExpiringBoolean();

	beforeNavigate(() => {
		if (modalTimer) {
			clearTimeout(modalTimer);
		}
	});

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
		modalTimer = setTimeout(() => modal.open({ answers, guesses, user }), 500);
	};

	const handleKey = (key: string) => {
		form = { invalid: false, success: false };
		if (key.toLowerCase() === 'enter') {
			formElement.requestSubmit();
		} else {
			data.state = applyKey(key, data.state, data.answers);
			data = data;
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
		} else if (data.success) {
			return filteredLength - 6 + i;
		} else {
			return filteredLength - 5 + i;
		}
	};

	onMount(() => {
		if (data.success) {
			openModal({
				answers: data.answers,
				guesses: data.state.length,
				user: data.session?.user.login
			});
		}
	});

	function toastError(message: string) {
		const style =
			'border-radius: 0.5rem; color: var(--snow-300); background: var(--charade-700); padding: 1rem 1.5rem; font-size: 18px;';
		toast.error(message, {
			style,
			iconTheme: {
				primary: 'var(--aurora-100)',
				secondary: 'var(--snow-300)'
			}
		});
	}

	function toastPromise(
		promise: Promise<unknown>,
		opts: { success: string; error: string; loading: string }
	) {
		const style =
			'border-radius: 0.5rem; color: var(--snow-300); background: var(--charade-700); padding: 1rem 1.5rem; font-size: 18px;';
		toast.promise(promise, opts, {
			style,
			iconTheme: {
				primary: 'var(--aurora-400)',
				secondary: 'var(--snow-300)'
			}
		});
	}

	let resolvePromise: (value: unknown) => void;
	const handleWordResult = async ({ update }: { update: () => void }) => {
		if (resolvePromise) {
			resolvePromise(undefined);
		}
		await new Promise((resolve) => setTimeout(resolve, 500));
		update();
		if (form?.success) {
			openModal({
				answers: data.answers,
				guesses: data.state.length,
				user: data.session?.user.login
			});
		}
	};
	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		// disable submit if game already won
		if (data.success) {
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
			setInvalidFormTrue();
			return;
		}
		const { metadata, updatedAnswers, updatedGuesses } = applyWord(
			data.state.filter((guess): guess is CompleteGuess => guess.complete),
			guess,
			data.answers
		);
		form = metadata;
		if (metadata.invalid) {
			toastError('invalid word');
			cancel();
			return;
		}
		data.answers = updatedAnswers;
		if (!metadata.invalid) {
			data.state = updatedGuesses;
		}
		data = data;
		Cookies.set('wordLettuce', getCookieFromGameState(data.state), {
			path: '/',
			httpOnly: false,
			expires: 1,
			secure: false
		});

		if (!metadata.success) {
			cancel();
			return;
		}
		data.success = true;
		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		toastPromise(promise, {
			loading: 'saving results',
			error: 'oh nooo',
			success: 'results saved'
		});
		return handleWordResult;
	};

	let formElement: HTMLFormElement;

	const delayScale = 0.03;
	const duration = 0.15;
</script>

<div class="flex flex-auto flex-col items-center gap-2">
	<main class="flex w-full flex-auto flex-col items-center justify-end justify-between gap-2">
		<div class="flex w-full flex-auto flex-col items-center">
			<form
				method="POST"
				action="?/enter"
				id="game"
				bind:this={formElement}
				use:enhance={enhanceForm}
				class="my-auto flex w-full max-w-[min(700px,_55vh)]"
			>
				<div class="grid w-full grid-rows-[repeat(6,_1fr)] gap-2">
					{#each [...Array(6).keys()] as i (getRealIndex(i, data.state, data.answers))}
						{@const realIndex = getRealIndex(i, data.state, data.answers)}
						{@const current = realIndex === data.answers.length}
						<div
							animate:flip={{ duration: duration * 1000 }}
							out:slide|local={{ duration: duration * 1000 }}
							class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
						>
							{#each [...Array(5).keys()] as j}
								{@const answer = data.answers?.at(realIndex)?.at(j) ?? ''}
								{@const letter = data.state[realIndex]?.guess?.at(j) ?? ''}
								{@const doJump = browser && data.answers.at(realIndex)?.length === 5}
								{@const doWiggle = browser && $invalidForm && current}
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
									style:animation-delay={`${j * delayScale}s`}
									style:transition-duration={`${duration}ms`}
									class:animate-jump={doJump}
									style:z-index={realIndex}
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
				answers={getKeyStatuses(data.state, data.answers)}
			/>
		</div>
	</main>
	<Modal bind:this={modal} />
	<Toaster />
</div>
