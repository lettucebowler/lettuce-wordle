<script lang="ts">
	import { fly } from 'svelte/transition';
	import type { Word } from '$lib/types/types';
	import { getGameStatus } from '$lib/util/share';
	import { appName } from '$lib/util/store';

	export let success: boolean;
	export let guesses: number;
	export let words: Word[];

	export const modalActions = {
		open() {
			share = getGameStatus($appName, words);
			visible = true;
			dialog.showModal();
		}
	};

	let dialog;
	let share = '';
	let message = '';

	const clearMessage = () => {
		message = '';
	};

	const setMessage = (m: string) => {
		message = m;
	};

	const shareGame = () => {
		share = getGameStatus($appName, words);
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
	const getClasses = (visible: boolean) => {
		const classes = [];
		classes.push('modal');
		!visible && classes.push('hide');
		return classes.join(' ');
	};

	$: classString = getClasses(visible);

	const closeModal = (visible: boolean) => {
		if (!visible) {
			dialog.close();
			visible = false;
		}
	};
</script>

<dialog
	bind:this={dialog}
	class={classString}
	open={false}
	on:animationend={() => closeModal(visible)}
>
	<div class="flex">
		<h2>{success ? 'Success' : 'Dang'}!</h2>
		{#if success}
			<p>
				You solved today's WordLettuce in {guesses} guess{guesses > 1 ? 'es' : ''}. Come back
				tomorrow and play again!
			</p>
		{:else}
			<p>You used up all of your guesses. Come back tomorrow (or refresh) and try again!</p>
		{/if}
		<div class="toasty">
			{#if message}
				<span
					in:fly={{ duration: 400, y: 50, opacity: 0 }}
					out:fly={{ duration: 400, y: 50, opacity: 0 }}>{message}</span
				>
			{/if}
		</div>
		<div class="button-container">
			<button on:click={() => shareGame()}>Share</button>
			<button
				class="close"
				on:click={() => {
					visible = false;
				}}>Close</button
			>
		</div>
	</div>
</dialog>

<style>
	.flex {
		display: flex;
		gap: 12px;
		flex-direction: column;
	}

	.toasty {
		height: 2rem;
		display: grid;
		place-items: center;
	}

	.modal {
		max-width: 300px;
		width: 100%;
		border-radius: 18px;
		border-color: var(--nord-3);
		box-sizing: border-box;
		padding: 12px;
		background-color: var(--nord-1);
	}

	.modal.hide::backdrop {
		animation: fadeout 0.5s forwards;
	}

	.modal::backdrop {
		backdrop-filter: blur(4px);
		animation: fadein 0.5s forwards;
	}

	.modal[open] {
		opacity: 1;
		pointer-events: auto;
		animation: slidein 0.5s forwards;
	}

	.modal.hide[open] {
		animation: slideout 0.5s forwards;
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

	button {
		border-radius: 6px;
		border-color: transparent;
		background-color: var(--nord-10);
		font-size: 1rem;
		font-weight: 700;
		padding: 6px;
		color: var(--nord-6);
		transition: 0.5s;
		cursor: pointer;
		height: 3.3rem;
		width: 100%;
	}

	button:hover {
		filter: brightness(90%);
	}

	button:active {
		filter: brightness(80%);
	}

	h2 {
		text-align: center;
		margin-top: 0;
		color: var(--nord-6);
	}

	p,
	span {
		color: var(--nord-6);
		padding: 4px;
		text-align: center;
	}

	span {
		z-index: -1;
	}

	.button-container {
		width: 100%;
		display: flex;
		gap: 6px;
		flex-direction: row;
		justify-content: space-between;
		color: var(--text-color);
	}

	.close {
		background-color: var(--nord-12);
	}
</style>
