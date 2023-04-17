<script lang="ts">
	import { fly } from 'svelte/transition';
	import { getGameStatus } from '$lib/util/share';
	import { appName } from '$lib/stores/appName';
	import { clickOutsideAction, clickToCopyAction } from 'svelte-legos';
	import { timeUntilNextGame } from '$lib/stores/time';
	import AuthForm from '$lib/components/AuthForm.svelte';
	import { trapFocus } from '$lib/actions/trapFocus';

	export function open(answers: string[], guesses: number, success: boolean, user = '') {
		authenticated = !!user;
		share = getGameStatus($appName, answers);
		attempts = guesses;
		won = success;
		visible = true;
		if (dialog && !dialog.open) {
			dialog.showModal();
		}
	}

	let dialog: HTMLDialogElement;
	let share = '';
	let attempts: number;
	let won: boolean;
	let message = '';
	let authenticated = false;

	let visible = false;

	const closeModal = () => {
		dialog.close();
		visible = false;
	};

	const formatTime = (secondsUntil: number) => {
		const hours = Math.floor(secondsUntil / 3600);
		const minutes = Math.floor((secondsUntil % 3600) / 60);
		const seconds = secondsUntil % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	};
</script>

<dialog
	bind:this={dialog}
	class="open:opacity-1 box-border w-full max-w-xs rounded-2xl bg-charade-800 p-2 backdrop:animate-fadein backdrop:backdrop-blur-sm open:pointer-events-auto open:animate-flyup"
	open={false}
	use:trapFocus
>
	<div class="flex flex-col gap-2" use:clickOutsideAction on:clickoutside={closeModal}>
		<div class="flex h-8 justify-between">
			<div class="aspect-square h-full" />
			<h2 class="col-start-2 mt-0 flex-auto text-center text-2xl text-snow-300">&nbsp;Success!</h2>
			<button
				on:click={closeModal}
				class="aspect-square h-8 rounded p-1 text-snow-300 transition transition-all hover:bg-charade-900 hover:p-0"
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
			{#if message}
				<span
					class="-z-10 p-2 text-center text-snow-300"
					in:fly={{ duration: 400, y: 50, opacity: 0 }}
					out:fly={{ duration: 400, y: 50, opacity: 0 }}>{message}</span
				>
			{/if}
		</div>
		<div class="grid place-items-center p-2 text-center font-bold text-snow-300">
			Next word in {formatTime($timeUntilNextGame)}
		</div>
		{#if !authenticated}
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
				use:clickToCopyAction={share}
				on:copy-done={() => {
					message = 'Results copied to clipboard';
					setTimeout(() => (message = ''), 4000);
				}}
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