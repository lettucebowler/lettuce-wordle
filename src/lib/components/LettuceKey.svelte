<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Status } from '../types/types';
	import '$lib/styles/app.css';

	export let key: string;
	export let status: Status = Status.NONE;

	const dispatch = createEventDispatcher();

	const typeKey = (key: string) => {
		dispatch('keyPress', {
			key
		});
	};

	const icons = {
		enter: 'icon-keyboard_return',
		share: 'icon-share',
		delete: 'icon-backspace'
	};
</script>

{#if key in icons}
	<button aria-label={key} title={key} on:click={() => typeKey(key)} class={status}
		><span class={icons[key]} /></button
	>
{:else}
	<button aria-label={key} title={key} on:click={() => typeKey(key)} class={status}>{key}</button>
{/if}

<style>
	button {
		height: 100%;
		width: 100%;
		min-height: 50px;
		aspect-ratio: 0.9;
		display: block;
		border: solid;
		border-color: transparent;
		background-color: var(--nord-3);
		font-size: 1rem;
		font-weight: 900;
		color: var(--nord-6);
		border-radius: 6px;
		text-align: center;
		padding: 0 0;
	}

	button:hover {
		filter: brightness(90%);
	}

	button:active {
		filter: brightness(80%);
	}

	.icon {
		font-size: 1rem;
	}

	.none {
		background-color: var(--incorrect);
	}

	.correct {
		background-color: var(--correct);
	}

	.contains {
		background-color: var(--contains);
	}

	.incorrect {
		background-color: var(--nord-1);
	}
</style>
