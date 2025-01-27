<script lang="ts">
	import BetterModal from './Modal.svelte';
	import { flip } from 'svelte/animate';
	import { applyAction, enhance } from '$app/forms';
	import Tile from './Tile.svelte';
	import Cookies from 'js-cookie';
	import { Toaster } from 'svelte-french-toast';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { createExpiringBoolean } from './spells.svelte';
	import { browser } from '$app/environment';
	import { toastError, toastLoading, toastSuccess } from './toast';
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import ShareIcon from '$lib/components/ShareIcon.svelte';
	import EnterIcon from '$lib/components/EnterIcon.svelte';
	import BackSpaceIcon from '$lib/components/BackSpaceIcon.svelte';
	import { WordlettuceGame } from '$lib/game/wordlettuce-game.svelte';
	import { STATE_COOKIE_NAME_V2 } from '$lib/constants/app-constants';
	import * as v from 'valibot';
	import { GameKey, LetterStatus } from '$lib/schemas/game';
	import Key from './Key.svelte';

	let { form, data } = $props();
	let wordForm: HTMLFormElement | undefined = $state();

	const wordIsInvalid = createExpiringBoolean();
	const submittingWord = createExpiringBoolean();
	const duration = 0.15;

	let game = $state(
		new WordlettuceGame({
			gameNum: data.game.gameNum,
			guesses: data.game.guesses,
			currentGuess: data.game.currentGuess
		})
	);

	$effect(() => {
		game = new WordlettuceGame({
			gameNum: data.game.gameNum,
			guesses: data.game.guesses,
			currentGuess: data.game.currentGuess
		});
	});

	function showModal() {
		pushState('', {
			showModal: true
		});
	}

	function saveGameStateToCookie() {
		Cookies.set(STATE_COOKIE_NAME_V2, game.toStateString(), {
			path: '/',
			httpOnly: false,
			expires: 1,
			secure: false
		});
	}

	function handleKey(key: string) {
		const parseResult = v.safeParse(GameKey, key);
		if (!parseResult.success) {
			return;
		}
		if (parseResult.output === 'enter') {
			wordForm?.requestSubmit();
			return;
		}
		if (parseResult.output === 'backspace') {
			game.doUndo();
			return;
		}
		game.doLetter(parseResult.output);
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
		const maxPreviousGuesses = game.success ? 6 : 5;
		const maxFillerGuesses = 5;

		const previousGuesses = game.guesses
			.map((guess, index) => ({ index, guess }))
			.slice(-1 * maxPreviousGuesses);
		const currentGuesses = game.success
			? []
			: [
					{
						index: game.guesses.length,
						guess: game.currentGuess
					}
				];
		const fillerGuesses = Array(maxFillerGuesses)
			.fill(null)
			.map((_, index) => ({
				index: game.guesses.length + (game.success ? 0 : 1) + index,
				guess: ''
			}));
		const items = [...previousGuesses, ...currentGuesses, ...fillerGuesses]
			.filter(Boolean)
			.slice(0, 6);
		return items;
	}

	const enhanceForm: SubmitFunction = async ({ formData, cancel }) => {
		if (submittingWord.value || game.success) {
			cancel();
			return;
		}
		submittingWord.truthify();
		const { error } = game.doSumbit();
		if (error) {
			cancel();
			return invalidForm();
		}
		form = {
			success: game.success,
			invalid: false
		};
		if (!game.success) {
			cancel();
			saveGameStateToCookie();
			return;
		}

		let saveGameToastId: string;
		if (data.session?.user) {
			saveGameToastId = toastLoading('Saving results...');
		}
		return async ({ result, update }) => {
			applyAction(result);
			if (saveGameToastId) {
				if (result.type === 'success') {
					toastSuccess('Game results saved', { id: saveGameToastId });
				} else {
					toastError('Failed to save game results', { id: saveGameToastId });
				}
			}
			update();
			setTimeout(() => showModal(), 500);
		};
	};
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
					{@const current = item.index === game.answers.length}
					<div
						class="grid w-full grid-cols-[repeat(5,1fr)] gap-2"
						animate:flip={{ duration: duration * 1000 }}
						data-index={item.index}
						style="--tile-height:2px;"
					>
						{#each item.guess.padEnd(5, ' ').slice(0, 5).split('') as letter, j}
							{@const doJump = browser && game.answers.at(item.index)?.length === 5}
							{@const doWiggle = browser && wordIsInvalid.value && current}
							{@const doWiggleOnce = !browser && form?.invalid && current}
							<div
								class={[
									'bg-charade-950 z-(--z-index) aspect-square min-h-0 w-full rounded-xl shadow-[inset_0_var(--tile-height)_var(--tile-height)_0_rgb(0_0_0/0.2),inset_0_calc(-1*var(--tile-height))_0_0_var(--color-charade-800)]',
									!item.guess && current && wordIsInvalid.value && 'animate-wiggle-once'
								]}
							>
								<Tile
									letter={letter === ' ' ? '' : letter}
									answer={game.answers.at(item.index)?.charAt(j)}
									column={j}
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
			<div
				class="grid flex-auto grid-cols-[repeat(40,0.25fr)] grid-rows-3 gap-1"
				style="--keyboard-height: 1px;"
			>
				{#each 'q,w,e,r,t,y,u,i,o,p,,a,s,d,f,g,h,j,k,l,z,x,c,v,b,n,m'.split(',') as letter}
					{@const status = game.letterStatuses[letter]}
					{#if letter}
						<Key
							status={status as LetterStatus}
							aria-label={letter}
							title={letter}
							formaction="?/letter"
							name="key"
							value={letter}
						>
							{letter}
						</Key>
					{:else}
						<div></div>
					{/if}
				{/each}
				<Key aria-label="enter" title="enter" formAction="?/word" name="key" value="enter"
					><EnterIcon /></Key
				>
				<button
					aria-label="enter"
					title="enter"
					formAction="?/word"
					name="key"
					value="enter"
					form="game"
					class="bg-charade-600 text-charade-100 col-span-4 mt-[1px] grid h-full w-full cursor-pointer place-items-center rounded-md text-center text-sm font-bold shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--color-charade-400)] active:mt-0 active:shadow-none sm:py-2 md:text-xl"
					><div class="h-5 w-full lg:h-7"><EnterIcon /></div></button
				>
				<button
					aria-label="backspace"
					title="backspace"
					formAction="?/letter"
					name="key"
					value="backspace"
					class="bg-charade-600 text-charade-100 col-span-4 mt-[1px] grid h-full w-full cursor-pointer place-items-center rounded-md text-center text-sm font-bold shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--color-charade-400)] active:mt-0 active:shadow-none sm:py-2 md:text-xl"
					><div class="h-5 w-full lg:h-7"><BackSpaceIcon /></div></button
				>
				{#if game.success}
					<button
						aria-label="share"
						title="share"
						onclick={() => showModal()}
						type="button"
						class="bg-charade-600 text-charade-100 col-span-4 mt-[1px] grid h-full w-full cursor-pointer place-items-center rounded-md text-center text-sm font-bold shadow-[0_var(--keyboard-height)_4px_0_rgb(0_0_0_/_0.2),0_calc(-1*var(--keyboard-height))_0_0_var(--color-charade-400)] active:mt-0 active:shadow-none sm:py-2 md:text-xl"
						><div class="h-5 w-full lg:h-7"><ShareIcon /></div></button
					>
				{/if}
			</div>
		</form>
	</main>
	{#if page.state.showModal}
		<BetterModal
			answers={game.answers}
			user={data.session?.user?.login}
			close={() => history.back()}
		/>
	{/if}
	<Toaster />
</div>
