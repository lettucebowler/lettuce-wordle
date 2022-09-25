<script lang="ts">
	import { fly } from 'svelte/transition';
	import { getGameStatus } from '$lib/util/share';
	import { appName } from '$lib/util/store';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export const modalActions = {
		open(answers: string[], guesses: number, success: boolean) {
			share = getGameStatus($appName, answers);
			attempts = guesses;
			won = success;
			visible = true;
			if (dialog && !dialog.open) {
				dialog.showModal();
			}
		}
	};

	let dialog: HTMLDialogElement;
	let share = '';
	let attempts: number;
	let won: boolean;
	let statuses;
	let message = '';

	const clearMessage = () => {
		message = '';
	};

	const setMessage = (m: string) => {
		message = m;
	};

	const shareGame = () => {
		message = 'Results Copied to clipboard!';
		setTimeout(() => clearMessage(), 4000);
		(!!navigator &&
			navigator.clipboard
				.writeText(share)
				.then(() => setMessage('Results Copied to clipboard!'))
				.catch(() => setMessage('Failed clipboard copy.'))) ||
			setMessage('Failed clipboard copy.');
	};

	let visible = false;

	const closeModal = (visible: boolean) => {
		if (!visible) {
			dialog.close();
			visible = false;
		}
	};

	const formatTime = (secondsUntil: number) => {
		const hours = Math.floor(secondsUntil / 3600);
		const minutes = Math.floor((secondsUntil % 3600) / 60);
		const seconds = secondsUntil % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	};

	const getTimeUntilReset = () => {
		const now = new Date().getTime();
		const tomorrow = new Date();
		tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
		tomorrow.setUTCHours(0, 0, 0, 0);
		const secondsUntil = Math.floor((tomorrow.getTime() - now) / 1000);
		if (browser && secondsUntil === 0) {
			location.reload();
		}
		return secondsUntil;
	};

	let timeUntil: number = getTimeUntilReset();

	onMount(() => {
		setInterval(() => {
			timeUntil = getTimeUntilReset();
		}, 1000);
	});
</script>

<dialog
	bind:this={dialog}
	class="w-full max-w-xs rounded-2xl p-2 bg-polar-200 box-border open:opacity-1 backdrop:backdrop-blur-sm open:pointer-events-auto"
	open={false}
	on:animationend={() => closeModal(visible)}
>
	<div class="flex flex-col gap-3">
		<h2 class="text-center mt-0 text-snow-300">{won ? 'Success' : 'Dang'}!</h2>
		<p class="text-snow-300 p-2 text-center">
			{#if won}
				You solved today's WordLettuce in {attempts} guess{attempts > 1 ? 'es' : ''}. Come back
				tomorrow and play again!
			{:else}
				You used up all of your guesses. Come back tomorrow (or delete your cookies) and try again!
			{/if}
		</p>
		<div class="h-8 grid place-items-center">
			{#if message}
				<span
					class="text-snow-300 p-2 text-center -z-10"
					in:fly={{ duration: 400, y: 50, opacity: 0 }}
					out:fly={{ duration: 400, y: 50, opacity: 0 }}>{message}</span
				>
			{/if}
		</div>
		<div class="grid place-items-center text-snow-300 p-2 text-center font-bold">
			Next word in {formatTime(timeUntil)}
		</div>
		<div class="w-full flex gap-3 flex-row justify-center">
			<button
				on:click={() => shareGame()}
				class="rounded-lg border-transparent bg-frost-400 font-bold p-0 text-snow-300 cursor-pointer h-12 w-full active:brightness-90"
				><div
					class="hover:backdrop-filter hover:backdrop-brightness-90 duration-500 h-full grid items-center"
				>
					Share
				</div></button
			>
		</div>
	</div>
</dialog>

<style>
	dialog::backdrop {
		animation: fadein 0.5s forwards;
	}

	dialog[open] {
		animation: slidein 0.5s forwards;
	}

	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes fadeout {
		to {
			opacity: 0;
		}
	}

	@keyframes slidein {
		from {
			transform: translateY(+100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	@keyframes slideout {
		from {
			transform: translateY(0);
			opacity: 1;
		}
		to {
			transform: translateY(+100%);
			opacity: 0;
		}
	}
</style>
