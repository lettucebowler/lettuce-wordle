<script lang="ts">
	import Modal from './Modal.svelte';
	import BetterModal from './BetterModal.svelte';
	import { slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import Keyboard from './Keyboard.svelte';
	import Tile from './Tile.svelte';
	import { applyKey, getKeyStatuses, applyWord } from '$lib/util/gameFunctions';
	import { getCookieFromGameState } from '$lib/util/encodeCookie';
	import Cookies from 'js-cookie';
	import { Toaster } from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { CompleteGuessOutput, IncompleteGuess } from '$lib/types/gameresult';
	import { AllowedWordSchema } from '$lib/types/gameresult';
	import { createExpiringBoolean } from './stores';
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { toastError, toastLoading, toastSuccess } from './toast';
	import * as v from 'valibot';
	import cx from 'classix';

	let { form, data } = $props();

	$effect(() => {
		if (form?.invalid) {
			wordIsInvalid.setTrue();
			toastError('Invalid word');
		}
	});

	let modal: Modal | BetterModal;
	const wordIsInvalid = createExpiringBoolean();
	const submittingWord = createExpiringBoolean();
	const duration = 0.15;

	let modalTimer: NodeJS.Timeout;
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
			data.state = applyKey(key, data.state, data.answers);
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

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		if ($submittingWord || data.success) {
			cancel();
			return;
		}
		submittingWord.setTrue();
		const guessData = v.safeParse(
			AllowedWordSchema,
			formData
				.getAll('guess')
				.map((l) => l.toString().toLowerCase())
				.join('')
		);
		if (!guessData.success) {
			cancel();
			form = {
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
			data.state.filter((guess): guess is CompleteGuessOutput => guess.complete),
			guess,
			data.answers
		);
		if (metadata.invalid) {
			cancel();
			form = {
				success: false,
				invalid: true
			};
			return;
		}
		data.state = updatedGuesses;
		data.answers = updatedAnswers;
		Cookies.set('wordLettuce', getCookieFromGameState(data.state), {
			path: '/',
			httpOnly: false,
			expires: 1,
			secure: false
		});

		data.success = metadata.success;
		if (!metadata.success) {
			cancel();
			form = {
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
				answers: data.answers,
				guesses: data.state.length,
				user: data.session?.user?.login
			});
		};
	};

	$effect(() => {
		if (data.success) {
			openModal({
				answers: data.answers,
				guesses: data.state.length,
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
					{#each [...Array(6).keys()] as i (getRealIndex(i, data.state, data.answers))}
						{@const realIndex = getRealIndex(i, data.state, data.answers)}
						{@const current = realIndex === data.answers.length}
						{@const guess = data.state?.at(realIndex)?.guess ?? ''}
						<div
							class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
							out:slide={{ duration: duration * 1000 }}
							animate:flip={{ duration: duration * 1000 }}
						>
							{#each [...Array(5).keys()] as j}
								{@const answer = data.answers?.at(realIndex)?.at(j) ?? ''}
								{@const letter = guess?.at(j) ?? ''}
								{@const doJump = browser && data.answers.at(realIndex)?.length === 5}
								{@const doWiggle = browser && $wordIsInvalid && current}
								{@const doWiggleOnce = !browser && form?.invalid && current}
								<div
									class={cx(
										'z-[--z-index] aspect-square min-h-0 w-full rounded-xl bg-charade-950',
										/* shadows and highlights */ 'shadow-[inset_0_var(--height)_var(--height)_0_rgb(0_0_0_/_0.2),_inset_0_calc(-1_*_var(--height))_0_0_theme(colors.charade.800)]',
										!guess && current && $wordIsInvalid && 'animate-wiggle-once'
									)}
								>
									<Tile
										--column={j}
										--tile-height="3px"
										{letter}
										{answer}
										{doJump}
										{doWiggle}
										{doWiggleOnce}
										{current}
									/>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			</form>
		</div>
		<div class="flex h-full max-h-[min(20rem,_30vh)] w-full flex-[5_1_auto] flex-col">
			<Keyboard
				--height="1px"
				onkey={handleKey}
				answers={getKeyStatuses(data.state, data.answers)}
			/>
		</div>
		<div></div>
	</main>
	<!-- <Modal bind:this={modal} /> -->
	<BetterModal bind:this={modal} answers={data.answers} user={data.session?.user?.login} />
	<Toaster />
</div>

<style>
	:root {
		--height: 3px;
	}
</style>
