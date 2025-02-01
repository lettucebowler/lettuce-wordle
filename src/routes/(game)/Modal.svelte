<script lang="ts">
	import { fly } from 'svelte/transition';
	import { clickOutsideAction, trapFocus } from './actions';
	import { appName } from '$lib/constants/app-constants';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { createExpiringString, createNewGameCountDownTimer } from './spells.svelte';

	type ModalProps = {
		gameNum: number;
		answers: Array<string>;
		user?: string;
		close: () => void;
	};

	let { answers, user, gameNum, close }: ModalProps = $props();
	let isAuthenticated = $derived(!!user);
	let attempts = $derived(answers.length);
	const clipboardMessage = createExpiringString();
	let dialog: HTMLDialogElement | undefined = $state();
	const timeUntilNextGame = createNewGameCountDownTimer();

	let modalTimeout = $state(setTimeout(() => {}));

	$effect(() => {
		openModal();
	});

	export function openModal() {
		modalTimeout = setTimeout(() => {
			dialog?.showModal();
			timeUntilNextGame.start();
		}, 0);
	}

	export function cleanup() {
		if (modalTimeout) {
			clearTimeout(modalTimeout);
		}
		if (dialog?.open) {
			dialog?.close();
			timeUntilNextGame.pause();
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

	function getGameStatus(statuses: Array<string>) {
		const today = `${appName} ${gameNum} ${statuses.length}/6`;
		const strings = statuses.map((k) => {
			return k
				.split('')
				.map((w) => {
					return getStatusEmoji(w);
				})
				.join('');
		});
		return [today, ...strings].join('\n');
	}

	function getStatusEmoji(status: string) {
		switch (status) {
			case 'x':
				return '🟩';
			case 'c':
				return '🟨';
			case '_':
			case 'i':
			default:
				return '⬛';
		}
	}
</script>

<dialog
	bind:this={dialog}
	class="bg-charade-900 backdrop:animate-fadein open:animate-flyup m-auto box-border w-full max-w-xs rounded-2xl p-2 backdrop:backdrop-blur-xs open:pointer-events-auto"
	open={false}
	use:trapFocus
	onclose={() => {
		close();
	}}
>
	<div class="flex flex-col gap-2" use:clickOutsideAction={cleanup}>
		<div class="flex h-8 justify-between">
			<div class="aspect-square h-full"></div>
			<h2 class="text-snow-300 col-start-2 mt-0 flex-auto text-center text-2xl">&nbsp;Success!</h2>
			<button
				aria-label="close modal"
				onclick={cleanup}
				class="text-snow-300 hover:bg-charade-950 aspect-square h-8 rounded-sm p-1 transition transition-all hover:p-0"
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
		<p class="text-snow-300 p-2 text-center">
			You solved today's WordLettuce in {attempts} guess{attempts > 1 ? 'es' : ''}. Come back
			tomorrow and play again!
		</p>
		<div class="grid h-8 place-items-center">
			{#if clipboardMessage.value}
				<span
					class="text-snow-300 -z-10 p-2 text-center"
					in:fly={{ duration: 400, y: 50, opacity: 0 }}
					out:fly={{ duration: 400, y: 50, opacity: 0 }}>{clipboardMessage.value}</span
				>
			{/if}
		</div>
		<div class="text-snow-300 grid place-items-center p-2 text-center font-bold">
			Next word in {formatTime(timeUntilNextGame.value)}
		</div>
		{#if !isAuthenticated}
			<AuthForm mode="login">
				<div class="flex w-full flex-row justify-center gap-3">
					<button
						class="bg-antique-brass-500 text-antique-brass-800 h-12 w-full cursor-pointer rounded-lg border-transparent p-0 font-bold transition transition-all duration-500 hover:brightness-90"
					>
						Login to save your results
					</button>
				</div>
			</AuthForm>
		{/if}
		<div class="flex w-full flex-row justify-center">
			<button
				onclick={shareGame}
				class="bg-frost-400 text-snow-300 h-12 w-full cursor-pointer rounded-lg border-transparent p-0 font-bold transition transition-all duration-500 hover:brightness-90"
			>
				Share
			</button>
		</div>
	</div>
</dialog>
