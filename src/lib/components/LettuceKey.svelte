<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Status } from '../types/types';
	import '$lib/styles/app.css';

	export let key: string;
	export let width = 1;
	export let enabled = true;
	export let status: Status = Status.NONE;

	const dispatch = createEventDispatcher();

	const typeKey = (key: string) => {
		dispatch('keyPress', {
			key
		});
	};
</script>

{#if enabled}
	<div style="aspect-ratio: {width}; max-width: calc({10 * width}vw - 4p)">
		<button on:click={() => typeKey(key)} disabled={!enabled} class={status}
			>{key.toLowerCase()}</button
		>
	</div>
{/if}

{#if !enabled}
	<div style="aspect-ratio: {width}; max-width: calc({10 * width}vw - 4px)" />
{/if}

<style>
	button {
		width: calc(100% - 4px);
		height: calc(100% - 4px);
		display: inline-block;
		margin: 2px 2px 2px 2px;
		border: solid;
		border-color: transparent;
		background-color: var(--nord-3);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--nord-6);
		border-radius: 4px;
	}

	button:hover {
		/* background-color: var(--nord-2); */
		filter: brightness(90%);
	}

	button:active {
		/* background-color: var(--nord-1); */
		filter: brightness(80%);
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
