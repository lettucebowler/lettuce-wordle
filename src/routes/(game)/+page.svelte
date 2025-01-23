<script lang="ts">
	import BetterModal from './Modal.svelte';
	import { flip } from 'svelte/animate';
	import { applyAction, enhance } from '$app/forms';
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
	import type { GameState } from '$lib/schemas/game';
	import { STATE_COOKIE_NAME_V2, successAnswer } from '$lib/constants/app-constants';
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import ShareIcon from '$lib/components/ShareIcon.svelte';
	import EnterIcon from '$lib/components/EnterIcon.svelte';
	import BackSpaceIcon from '$lib/components/BackSpaceIcon.svelte';

	let { form, data } = $props();

	let gameState = $state(data.gameState);
	let success = $state(data.success);
	let answers = $state(data.answers);
	let wordForm: HTMLFormElement | undefined = $state();

	const wordIsInvalid = createExpiringBoolean();
	const submittingWord = createExpiringBoolean();
	const duration = 0.15;

	$effect(() => {
		gameState = data.gameState;
		answers = data.answers;
	});

	let keyStatuses = $derived(getKeyStatuses(gameState.guesses, answers));

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
		if (key === 'enter') {
			wordForm?.requestSubmit();
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

	$inspect(answers);
</script>

<svelte:window
	on:keydown={(e) => {
		handleKey(e.key.toLowerCase());
	}}
/>
<div class="max-h-min-content flex w-full flex-auto flex-col items-center gap-2">
	<main
		class="flex w-full flex-auto flex-col items-center justify-between justify-end gap-2 sm:gap-4"
	>
		<form
			method="POST"
			action="?/word"
			use:enhance={enhanceForm}
			id="game"
			bind:this={wordForm}
			class="my-auto flex w-full max-w-[min(700px,_55vh)]"
		>
			<div class="grid w-full max-w-700 grid-rows-[repeat(6,1fr)] gap-2">
				{#each getItemsForGrid() as item (item.index)}
					{@const current = item.index === answers.length}
					<div
						class="grid w-full grid-cols-[repeat(5,1fr)] gap-2"
						animate:flip={{ duration: duration * 1000 }}
						data-index={item.index}
					>
						{#each item.guess.padEnd(5, ' ').slice(0, 5).split('') as letter, j}
							{@const doJump = browser && answers.at(item.index)?.length === 5}
							{@const doWiggle = browser && wordIsInvalid.value && current}
							{@const doWiggleOnce = !browser && form?.invalid && current}
							<div
								class={{
									'bg-charade-950 z-(--z-index) aspect-square min-h-0 w-full rounded-xl shadow-[inset_0_var(--height)_var(--height)_0_rgb(0_0_0/0.2),inset_0_calc(-1*var(--height))_0_0_var(--color-charade-800)]': true,
									'animate-wiggle-once': !item.guess && current && wordIsInvalid.value
								}}
							>
								<Tile
									--column={j}
									--tile-height="3px"
									letter={letter === ' ' ? '' : letter}
									answer={answers.at(item.index)?.charAt(j)}
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
		<form
			method="POST"
			class="keyboard grid max-h-40 w-full flex-auto gap-1 sm:max-h-80"
			id="keyboard"
			use:enhance={({ cancel, formData }) => {
				const key = formData.get('key')?.toString() ?? '';
				handleKey(key);
				cancel();
			}}
		>
			<div class="grid flex-auto grid-cols-[repeat(40,0.25fr)] grid-rows-3 gap-1">
				{#each 'q,w,e,r,t,y,u,i,o,p,,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m'.split(',') as letter}
					{@const status = keyStatuses[letter] || '_'}
					{#if letter}
						<button
							aria-label={letter}
							title={letter}
							formaction={letter === 'enter' ? '?/word' : '?/letter'}
							form={letter === 'enter' ? 'game' : undefined}
							name="key"
							value={letter}
							data-answer={status}
							class={{
								'col-span-4 mt-(--keyboard-height) grid h-full w-full cursor-pointer place-items-center rounded-md bg-(--bg-color) text-center text-sm font-bold text-(--text-color)  active:shadow-none sm:py-2 md:text-xl': true,
								'shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0':
									['x', 'c', '_'].includes(status)
							}}
						>
							{#if letter === 'share'}
								<div class="h-5 w-full lg:h-7">
									<ShareIcon />
								</div>
							{:else}
								{letter.toUpperCase()}
							{/if}
						</button>
					{:else}
						<div></div>
					{/if}
				{/each}
				<button
					aria-label="enter"
					title="enter"
					formAction="?/word"
					name="key"
					value="enter"
					form="game"
					class="col-span-4 mt-[1px] grid h-full w-full cursor-pointer place-items-center rounded-md bg-(--bg-color) text-center text-sm font-bold text-(--text-color) shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0 active:shadow-none sm:py-2 md:text-xl"
					><div class="h-5 w-full lg:h-7"><EnterIcon /></div></button
				>
				<button
					aria-label="backspace"
					title="backspace"
					formAction="?/letter"
					name="key"
					value="backspace"
					class="col-span-4 mt-[1px] grid h-full w-full cursor-pointer place-items-center rounded-md bg-(--bg-color) text-center text-sm font-bold text-(--text-color) shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0 active:shadow-none sm:py-2 md:text-xl"
					><div class="h-5 w-full lg:h-7"><BackSpaceIcon /></div></button
				>
				{#if success}
					<button
						aria-label="share"
						title="share"
						onclick={() => showModal()}
						type="button"
						class="col-span-4 mt-[1px] grid h-full w-full cursor-pointer place-items-center rounded-md bg-(--bg-color) text-center text-sm font-bold text-(--text-color) shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--highlight-color)] active:mt-0 active:shadow-none sm:py-2 md:text-xl"
						><div class="h-5 w-full lg:h-7"><ShareIcon /></div></button
					>
				{/if}
			</div>
		</form>
	</main>
	{#if page.state.showModal}
		<BetterModal {answers} user={data.session?.user?.login} close={() => history.back()} />
	{/if}
	<Toaster />
</div>

<style>
	:root {
		--height: 3px;
	}

	[data-answer='c'] {
		--bg-color: var(--color-putty-500);
		--highlight-color: var(--color-putty-200);
		--text-color: var(--color-putty-900);
	}

	[data-answer='x'] {
		--bg-color: var(--color-swamp-green-500);
		--highlight-color: var(--color-swamp-green-200);
		--text-color: var(--color-swamp-green-900);
	}

	[data-answer='i'] {
		--bg-color: var(--color-charade-800);
		--highlight-color: var(--color-charade-600);
		--text-color: var(--color-charade-300);
	}

	button {
		--bg-color: var(--color-charade-600);
		--highlight-color: var(--color-charade-400);
		--text-color: var(--color-charade-100);
	}

	.keyboard {
		--keyboard-height: 1px;
	}
</style>
