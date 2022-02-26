<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Status } from '../types/types';
	import '../app.css';

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
	<div>
		<button
			on:click={() => typeKey(key)}
			style="aspect-ratio: {width}"
			disabled={!enabled}
			class={status}>{key.toLowerCase()}</button
		>
	</div>
{/if}

{#if !enabled}
	<div />
{/if}

<style>
	div {
		padding: 2px 2px 2px 2px;
	}

	button {
		width: 100%;
		display: inline-block;
		margin: 0 0;
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
