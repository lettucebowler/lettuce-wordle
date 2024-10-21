<script lang="ts">
	import BetterModal from './Modal.svelte';
	import { flip } from 'svelte/animate';
	import { applyAction, enhance } from '$app/forms';
	import Keyboard from './Keyboard.svelte';
	import Tile from './Tile.svelte';
	import {
		getKeyStatuses,
		checkWord,
		applyKey,
		applyWord,
		checkWordsV2
	} from '$lib/util/gameFunctions';
	import { encodeStateV2 } from '$lib/util/encodeCookie';
	import Cookies from 'js-cookie';
	import { Toaster } from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createExpiringBoolean } from './spells.svelte';
	import { browser } from '$app/environment';
	import { toastError, toastLoading, toastSuccess } from './toast';
	import cx from 'classix';
	import type { GameState } from '$lib/schemas/game';
	import { STATE_COOKIE_NAME_V2, successAnswer } from '$lib/constants/app-constants';
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';

	let { form, data } = $props();

	let gameState = $state(data.gameState);
	let success = $state(data.success);
	let answers = $state(data.answers);

	const wordIsInvalid = createExpiringBoolean();
	const submittingWord = createExpiringBoolean();
	const duration = 0.15;

	$effect(() => {
		gameState = data.gameState;
		answers = data.answers;
	});

	function writeStateToCookie(state: GameState) {
		Cookies.set(STATE_COOKIE_NAME_V2, encodeStateV2(state), {
			path: '/',
			httpOnly: false,
			expires: 1,
			secure: false
		});
	}

	function showModal() {
		pushState('', {
			showModal: true
		});
	}

	function handleKey(key: string) {
		if (key === 'share') {
			showModal();
		}
		const { error, gameState: newGameState } = applyKey({ gameState, key });
		if (error) {
			return;
		}
		gameState = newGameState;
	}

	function invalidForm(message = 'Invalid word') {
		form = {
			success: false,
			invalid: true
		};
		wordIsInvalid.truthify();
		toastError(message);
	}

	function getItemsForGrid() {
		const maxPreviousGuesses = success ? 6 : 5;
		const maxFillerGuesses = 5;

		const previousGuesses = gameState.guesses
			.map((guess, index) => ({ index, guess }))
			.slice(-1 * maxPreviousGuesses);
		const currentGuesses = success
			? []
			: [
					{
						index: gameState.guesses.length,
						guess: gameState.currentGuess
					}
				];
		const fillerGuesses = Array(maxFillerGuesses)
			.fill(null)
			.map((_, index) => ({
				index: gameState.guesses.length + (success ? 0 : 1) + index,
				guess: ''
			}));
		const items = [...previousGuesses, ...currentGuesses, ...fillerGuesses]
			.filter(Boolean)
			.slice(0, 6);
		return items;
	}

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		if (submittingWord.value || success) {
			cancel();
			return;
		}
		submittingWord.truthify();
		const guess = formData
			.getAll('guess')
			.map((l) => l.toString().toLowerCase())
			.join('');
		const { error, gameState: newGameState } = applyWord({ gameState, guess });
		if (error) {
			cancel();
			return invalidForm();
		}
		const newAnswers = checkWordsV2({ guesses: newGameState.guesses });
		const wordIsCorrect = checkWord({ guess: newGameState.guesses.at(-1) ?? '' }) === successAnswer;
		answers = newAnswers;
		gameState = newGameState;
		form = {
			success: wordIsCorrect,
			invalid: false
		};
		if (!wordIsCorrect) {
			cancel();
			writeStateToCookie(newGameState);
			return;
		}
		success = true;

		let id: string;
		if (data.session?.user) {
			id = toastLoading('Saving results...');
		}
		return async ({ result, update }) => {
			applyAction(result);
			if (data.session?.user?.login) {
				if (result.type === 'success') {
					toastSuccess('Game results saved', { id });
				} else {
					toastError('Failed to save game results', { id });
				}
			}
			update();
			setTimeout(() => showModal(), 500);
		};
	};
</script>

<div class="max-h-min-content flex w-full flex-auto flex-col items-center gap-2">
	<main
		class="flex w-full flex-auto flex-col items-center justify-end justify-between gap-2 sm:gap-4"
	>
		<form
			method="POST"
			action="?/word"
			use:enhance={enhanceForm}
			id="game"
			class="my-auto flex w-full max-w-[min(700px,_55vh)]"
		>
			<div class="max-w-700 grid w-full grid-rows-[repeat(6,_1fr)] gap-2">
				{#each getItemsForGrid() as item (item.index)}
					{@const current = item.index === answers.length}
					<div
						class="grid w-full grid-cols-[repeat(5,_1fr)] gap-2"
						animate:flip={{ duration: duration * 1000 }}
						data-index={item.index}
					>
						{#each item.guess.padEnd(5, ' ').slice(0, 5).split('') as letter, j}
							{@const doJump = browser && answers.at(item.index)?.length === 5}
							{@const doWiggle = browser && wordIsInvalid.value && current}
							{@const doWiggleOnce = !browser && form?.invalid && current}
							<div
								class={cx(
									'z-[--z-index] aspect-square min-h-0 w-full rounded-xl bg-charade-950',
									'shadow-[inset_0_var(--height)_var(--height)_0_rgb(0_0_0_/_0.2),_inset_0_calc(-1_*_var(--height))_0_0_theme(colors.charade.800)]',
									!item.guess && current && wordIsInvalid.value && 'animate-wiggle-once'
								)}
							>
								<Tile
									--column={j}
									--tile-height="3px"
									letter={letter === ' ' ? '' : letter}
									answer={answers.at(item.index)?.charAt(j) || '_'}
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
		<Keyboard
			--height="1px"
			onkey={handleKey}
			answers={getKeyStatuses(gameState.guesses, answers)}
			showShareKey={success}
		/>
	</main>
	{#if $page.state.showModal}
		<BetterModal {answers} user={data.session?.user?.login} close={() => history.back()} />
	{/if}
	<Toaster />
</div>

<style>
	:root {
		--height: 3px;
	}
</style>
