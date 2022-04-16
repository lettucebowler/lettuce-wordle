<script lang="ts">
	import CopyClipBoard from '$lib/components/CopyClipboard.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import type { Word } from '$lib/types/types';
	import { getGameStatus } from '$lib/util/share';
	import { appName } from '$lib/util/store';
	import { toastSuccess } from '$lib/util/toastActions';
	import '$lib/styles/app.css';

	export let words: Word[] = [];
	export const modalActions = {
		open() {
			console.log(dialog);
			share = getGameStatus($appName, words);
			dialog.showModal();
		}
	};

	let dialog;
	let share: string = '';

	const shareGame = () => {
		share = getGameStatus($appName, words);
		const clipBoard = new CopyClipBoard({
			target: document.getElementById('clipboard2'),
			props: { name: share }
		});
		clipBoard.$destroy();
		toastSuccess('Results copied to clipboard');
	};
</script>

<dialog bind:this={dialog} class="modal">
	<div class="toast">
		<SvelteToast />
	</div>
	<div id="clipboard2" />
	<h2>Success!</h2>
	<p>You solved today's WordLettuce in {words.filter((w) => w.complete).length} attempt{words.filter((w) => w.complete).length > 1 ? 's' : ''}. Come back tomorrow and play again!</p>
	<div class="button-container">
    	<button on:click={() => shareGame()}>Share</button>
		<button class="close" on:click={() => dialog.close()}>Close</button>
	</div>
</dialog>

<style>
	.modal {
        max-width: 300px;
		width: 100%;
		border-radius: 12px;
		border-color: var(--nord-3);
		box-sizing: border-box;
		padding: 6px;
		background-color: var(--nord-1);
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

	p {
		color: var(--nord-6);
		padding: 4px;
        text-align: center;
	}

	.button-container {
		width: 100%;
		display: flex;
        gap: 6px;
		flex-direction: row;
		justify-content: space-between;
		color: var(--text-color);
	}

	.toast {
		font-size: 1rem;
		font-weight: 700;
	}

	.close {
		background-color: var(--nord-12);
	}
</style>
