<script lang="ts">
	import { fly } from 'svelte/transition';
	import { clickOutsideAction, trapFocus } from './actions';
	import { appName } from '$lib/constants/app-constants';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { LetterStatusSchema } from '$lib/types/gameresult';
	import type { AnswerStringOutput } from '$lib/types/gameresult';
	import { safeParse } from 'valibot';
	import { getGameNum } from '$lib/util/words';
	import { createExpiringString, createNewGameCountDownTimer } from './spells.svelte';

	type ModalProps = {
		answers: Array<string>;
		user: string | undefined;
	};
	let { answers, user }: ModalProps = $props();
	let isAuthenticated = $derived(!!user);
	let attempts = $derived(answers.length);
	const clipboardMessage = createExpiringString();
	let dialog: HTMLDialogElement | undefined = $state();
	const timeUntilNextGame = createNewGameCountDownTimer();

	export function open() {
		if (dialog && !dialog.open) {
			dialog.showModal();
		}
	}

	function closeModal() {
		if (dialog?.close) {
			dialog.close();
		}
	}

	function shareGame() {
		if (!navigator?.clipboard) {
			clipboardMessage.write('navigator clipboard api not supported in this browser');
		}

		navigator.clipboard
			.writeText(getGameStatus(answers))
			.then(() => {
				clipboardMessage.write('Results Copied to clipboard!');
			})
			.catch(() => {
				clipboardMessage.write('Failed to copy to clipboard');
			});
	}

	function formatTime(secondsUntil: number) {
		const hours = Math.floor(secondsUntil / 3600);
		const minutes = Math.floor((secondsUntil % 3600) / 60);
		const seconds = secondsUntil % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	}

	function getGameStatus(statuses: AnswerStringOutput[]) {
		const gameNum = getGameNum();
		const today = `${appName} ${gameNum} ${statuses.length}/6`;
		const strings = statuses.map((k) => {
			return k
				.split('')
				.map((w) => {
					const parseResult = safeParse(LetterStatusSchema, w);
					if (!parseResult.success) {
						return '';
					}
					return getStatusEmoji(parseResult.output);
				})
				.join('');
		});
		return [today, ...strings].join('\n');
	}

	const green = '🟩';
	const yellow = '🟨';
	const black = '⬛';
	function getStatusEmoji(status: string) {
		const parseResult = safeParse(LetterStatusSchema, status);

		if (!parseResult.success) {
			return black;
		}

		switch (parseResult.output) {
			case 'x':
				return green;
			case 'c':
				return yellow;
			case '_':
			case 'i':
				return black;
		}
	}
</script>

<dialog
	bind:this={dialog}
	class="open:opacity-1 box-border w-full max-w-xs rounded-2xl bg-charade-900 p-2 backdrop:animate-fadein backdrop:backdrop-blur-sm open:pointer-events-auto open:animate-flyup"
	open={false}
	use:trapFocus
>
	<div class="flex flex-col gap-2" use:clickOutsideAction={closeModal}>
		<div class="flex h-8 justify-between">
			<div class="aspect-square h-full"></div>
			<h2 class="col-start-2 mt-0 flex-auto text-center text-2xl text-snow-300">&nbsp;Success!</h2>
			<button
				onclick={closeModal}
				class="aspect-square h-8 rounded p-1 text-snow-300 transition transition-all hover:bg-charade-950 hover:p-0"
				><svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="box-border aspect-square h-full"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
		<p class="p-2 text-center text-snow-300">
			You solved today's WordLettuce in {attempts} guess{attempts > 1 ? 'es' : ''}. Come back
			tomorrow and play again!
		</p>
		<div class="grid h-8 place-items-center">
			{#if clipboardMessage}
				<span
					class="-z-10 p-2 text-center text-snow-300"
					in:fly={{ duration: 400, y: 50, opacity: 0 }}
					out:fly={{ duration: 400, y: 50, opacity: 0 }}>{clipboardMessage}</span
				>
			{/if}
		</div>
		<div class="grid place-items-center p-2 text-center font-bold text-snow-300">
			Next word in {formatTime(timeUntilNextGame.value)}
		</div>
		{#if !isAuthenticated}
			<AuthForm mode="login">
				<div class="flex w-full flex-row justify-center gap-3">
					<button
						class="h-12 w-full cursor-pointer rounded-lg border-transparent bg-aurora-200 p-0 font-bold text-snow-300 active:brightness-90"
						><span
							class="grid h-full items-center duration-500 hover:backdrop-brightness-90 hover:backdrop-filter"
						>
							Login to save your results
						</span>
					</button>
				</div>
			</AuthForm>
		{/if}
		<div class="flex w-full flex-row justify-center gap-3">
			<button
				onclick={shareGame}
				class="h-12 w-full cursor-pointer rounded-lg border-transparent bg-frost-400 p-0 font-bold text-snow-300 active:brightness-90"
				><span
					class="grid h-full items-center duration-500 hover:backdrop-brightness-90 hover:backdrop-filter"
				>
					Share
				</span></button
			>
		</div>
	</div>
</dialog>
