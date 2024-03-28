<script lang="ts">
	import Modal from './Modal.svelte';
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
	import type { CompleteGuess, IncompleteGuess } from '$lib/types/gameresult';
	import { allowedGuess } from '$lib/types/gameresult';
	import { createExpiringBoolean } from './stores';
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { toastError, toastLoading, toastSuccess } from './toast';
	import { safeParse, string } from 'valibot';

	export let data;
	export let form;

	let modal: Modal;
	const wordIsInvalid = createExpiringBoolean();
	const submittingWord = createExpiringBoolean();
	const delayScale = 0.03;
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

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		if ($submittingWord || data.success) {
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
			data.state.filter((guess): guess is CompleteGuess => guess.complete),
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
		data = data;
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

	onMount(() => {
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

	$: {
		if (form?.invalid) {
			wordIsInvalid.setTrue();
			toastError('Invalid word');
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
					{#each [...Array(6).keys()] as i (getRealIndex(i, data.state, data.answers))}
						{@const realIndex = getRealIndex(i, data.state, data.answers)}
						{@const current = realIndex === data.answers.length}
						<div
							class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
							out:slide={{ duration: duration * 1000 }}
							animate:flip={{ duration: duration * 1000 }}
						>
							{#each [...Array(5).keys()] as j}
								{@const answer = data.answers?.at(realIndex)?.at(j) ?? ''}
								{@const letter = data.state[realIndex]?.guess?.at(j) ?? ''}
								{@const doJump = browser && data.answers.at(realIndex)?.length === 5}
								{@const doWiggle = browser && $wordIsInvalid && current}
								{@const doWiggleOnce = !browser && form?.invalid && current}
								<div
									class="rounded-xl bg-charade-950 shadow-[inset_0_3px_4px_0_rgb(0_0_0_/_0.2),_inset_0_-3px_0_0_theme('colors.charade.800')]"
								>
									<Tile
										{letter}
										{answer}
										{doJump}
										{doWiggle}
										{doWiggleOnce}
										wordIsInvalid={$wordIsInvalid}
										column={j}
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
				on:key={(e) => handleKey(e.detail)}
				answers={getKeyStatuses(data.state, data.answers)}
			/>
		</div>
	</main>
	<Modal bind:this={modal} />
	<Toaster />
</div>
